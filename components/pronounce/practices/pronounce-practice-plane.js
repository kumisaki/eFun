const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
  x: canvas.width / 2,  // Center the bird horizontally
  y: canvas.height / 2,
  width: 160, // Width of the bird image
  height: 120, // Height of the bird image
  velocity: 0
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  bird.x = canvas.width / 2;  // Center the bird horizontally
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const birdImage = new Image();
birdImage.src = '../../../assets/img/plane.png'; // Replace with the path to your bird image

let gravity = 0.05; // Reduced gravity for slower descent
let lift = -5;
let isGameRunning = false;
let animationFrameId;

function drawBird() {
  ctx.drawImage(birdImage, bird.x - bird.width / 2, bird.y - bird.height / 2, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  // Ensure bird does not go below canvas bottom
  if (bird.y + bird.height / 2 > canvas.height) {
    bird.y = canvas.height - bird.height / 2;
    bird.velocity = 0;
  }

  if (bird.y < 50 + bird.height / 2) { // Limit bird's highest position
    bird.y = 50 + bird.height / 2;
    bird.velocity = 0;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  updateBird();
  animationFrameId = requestAnimationFrame(gameLoop);
}

document.getElementById('backButton').addEventListener('click', () => {
  window.location.href = '../../../components/pronounce/pronounce.html';
});

document.getElementById('controlButton').addEventListener('click', () => {
  if (isGameRunning) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  isGameRunning = true;
  document.getElementById('controlButton').classList.add('button-pause');
  document.getElementById('controlButton').classList.remove('button-start');
  bird.y = canvas.height / 2; // Reset bird position
  bird.velocity = 0;
  gameLoop();
  startVoiceControl();
}

function stopGame() {
  isGameRunning = false;
  document.getElementById('controlButton').classList.add('button-start');
  document.getElementById('controlButton').classList.remove('button-pause');
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
        bird.velocity = lift - liftForce;
      }

      requestAnimationFrame(detectSound);
    }

    detectSound();
  }).catch(err => {
    console.error('Error accessing microphone:', err);
  });
}
