$(document).ready(function() {
  const canvas = $('#gameCanvas')[0];
  const ctx = canvas.getContext('2d');
  const character = window.location.search.substring(1);
  objectImage.src = `../../../assets/img/${character}-2.png`; 

  let object = {
    x: canvas.width / 2,  // Center the object horizontally
    y: canvas.height / 2,
    width: 160, // Width of the object image
    height: 120, // Height of the object image
    velocity: 0
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    object.x = canvas.width / 2;  // Center the object horizontally
  }

  resizeCanvas();
  $(window).on('resize', resizeCanvas);

  const objectImage = new Image();
  
  let gravity = 0.05; // Reduced gravity for slower descent
  let lift = -5;
  let isGameRunning = false;
  let animationFrameId;

  function drawobject() {
    ctx.drawImage(objectImage, object.x - object.width / 2, object.y - object.height / 2, object.width, object.height);
  }

  function updateobject() {
    object.velocity += gravity;
    object.y += object.velocity;

    // Ensure object does not go below canvas bottom
    if (object.y + object.height / 2 > canvas.height) {
      object.y = canvas.height - object.height / 2;
      object.velocity = 0;
    }

    if (object.y < 50 + object.height / 2) { // Limit object's highest position
      object.y = 50 + object.height / 2;
      object.velocity = 0;
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawobject();
    updateobject();
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  $('#backButton').on('click', function() {
    window.location.href = '../../../components/pronounce/pronounce.html';
  });

  $('#controlButton').on('click', function() {
    if (isGameRunning) {
      stopGame();
    } else {
      startGame();
    }
  });

  function startGame() {
    isGameRunning = true;
    $('#controlButton').addClass('button-pause').removeClass('button-start');
    object.y = canvas.height / 2; // Reset object position
    object.velocity = 0;
    gameLoop();
    startVoiceControl();
  }

  function stopGame() {
    isGameRunning = false;
    $('#controlButton').addClass('button-start').removeClass('button-pause');
    cancelAnimationFrame(animationFrameId);
  }

  function startVoiceControl() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function detectSound() {
        if (!isGameRunning) {
          stream.getTracks().forEach(track => track.stop()); // Stop audio stream
          return;
        }

        analyser.getByteTimeDomainData(dataArray);

        let maxAmplitude = 0;
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > maxAmplitude) {
            maxAmplitude = dataArray[i];
          }
        }

        if (maxAmplitude > 128) {
          let liftForce = (maxAmplitude - 128) / 10; // Adjust sensitivity
          object.velocity = lift - liftForce;
        }

        requestAnimationFrame(detectSound);
      }

      detectSound();
    }).catch(err => {
      console.error('Error accessing microphone:', err);
    });
  }
});
