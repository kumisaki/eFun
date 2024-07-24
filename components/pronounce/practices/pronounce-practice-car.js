const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '../../../components/pronounce/pronounce.html';
});

let car = {
    x: canvas.width - 160,  // Start from the right
    y: 10,
    width: 360, // Width of the car image
    height: 360, // Height of the car image
    velocity: 0
};

let gravity = 0.00;
let lift = -5;
let isGameRunning = false;
let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!isGameRunning) {
        car.x = canvas.width - 160; // Reset car position to right side only when the game is not running
    }
    car.y = canvas.height * 0.8;  // Center the car vertically
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const carImage = new Image();
carImage.src = '../../../assets/img/car.png'; // Replace with the path to your car image


function drawCar() {
    ctx.drawImage(carImage, car.x - car.width / 2, car.y - car.height / 2, car.width, car.height);
}

function updateCar() {
    if (car.velocity !== 0 && isGameRunning) {
        car.velocity += gravity;
        car.x += car.velocity;

        if (car.x - car.width / 2 < 0) {
            car.x = car.width / 2;
            stopGame();
            $('#gameOverModal').modal('show');
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    updateCar();
    animationFrameId = requestAnimationFrame(gameLoop);
}

document.getElementById('controlButton').addEventListener('click', () => {
    if (isGameRunning) {
        stopGame();
    } else {
        startGame();
    }
});

document.getElementById('yesButton').addEventListener('click', () => {
    $('#gameOverModal').modal('hide');
    resetGame();
    startGame();
});

document.getElementById('noButton').addEventListener('click', () => {
    window.location.href = 'https://example.com'; // Replace with your desired URL
});

function startGame() {
    isGameRunning = true;
    document.getElementById('controlButton').classList.add('button-pause');
    document.getElementById('controlButton').classList.remove('button-start');
    if (car.x >= canvas.width - 160) {
        car.x = canvas.width - 160; // Ensure the car starts from the right side at the beginning
    }
    gameLoop();
    startVoiceControl();
}

function stopGame() {
    isGameRunning = false;
    document.getElementById('controlButton').classList.remove('button-pause');
    document.getElementById('controlButton').classList.add('button-start');
    cancelAnimationFrame(animationFrameId);
}

function resetGame() {
    car.x = canvas.width - 160; // Reset car position to the right side
    car.velocity = 0;
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
                stream.getTracks().forEach(track => track.stop());
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
                car.velocity = lift - liftForce;
            } else if (isGameRunning) {
                car.velocity = 0;
            }

            requestAnimationFrame(detectSound);
        }

        detectSound();
    }).catch(err => {
        console.error('Error accessing microphone:', err);
    });
}