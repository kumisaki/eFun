document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '../../index.html';
});
// $('#myModal').modal('show');

document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const choice1 = document.getElementById('choice1');
    const choice2 = document.getElementById('choice2');
    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');
    const animationContainer = document.getElementById('animationContainer');
    const overlay = document.getElementById('overlay');
    // const nextButton = document.getElementById('nextButton');
    const nextButton = document.getElementById('modal_dialog_correct');
    // const completeButton = document.getElementById('completeButton');
    const completeButton = document.getElementById('modal_dialog_complete')

    const timerDisplay = document.getElementById('timerDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');

    let currentLevel = 0;
    let score = 0;
    let startTime = Date.now();
    let timerInterval;

    const levels = [
        { mainImage: 'apple.jpg', choice1: 'apple.jpg', choice2: 'banana.jpg' },
        { mainImage: 'banana.jpg', choice1: 'banana.jpg', choice2: 'cherry.jpg' },
        { mainImage: 'grape.jpg', choice1: 'pineapple.jpg', choice2: 'grape.jpg' },
        { mainImage: 'strawberry.jpg', choice1: 'grape.jpg', choice2: 'strawberry.jpg' },
        { mainImage: 'pear.jpg', choice1: 'pear.jpg', choice2: 'peach.jpg' },
        // { mainImage: 'peach.jpg', choice1: 'peach.jpg', choice2: 'pear.jpg' },
        // { mainImage: 'pear.jpg', choice1: 'pear.jpg', choice2: 'pineapple.jpg' },
        // { mainImage: 'pineapple.jpg', choice1: 'pineapple.jpg', choice2: 'strawberry.jpg' },
        // { mainImage: 'strawberry.jpg', choice1: 'strawberry.jpg', choice2: 'watermelon.jpg' },
        // { mainImage: 'watermelon.jpg', choice1: 'watermelon.jpg', choice2: 'kiwi.jpg' },
    ];

    function loadLevel(level) {
        const { mainImage: mainSrc, choice1: choice1Src, choice2: choice2Src } = levels[level];
        mainImage.src = mainSrc;
        choice1.src = choice1Src;
        choice2.src = choice2Src;
        choice1.classList.remove('shake');
        choice2.classList.remove('shake');
        resetImage(choice1);
        resetImage(choice2);
        // overlay.style.display = 'none';
        // nextButton.style.display = 'none';
    }

    function resetImage(image) {
        image.style.position = '';
        image.style.zIndex = '';
        image.style.animation = 'none'; // 取消动画以便重置位置
        image.style.transform = 'translate(0, 0)';
        image.style.transition = '';
    }

    function animateImage(image) {
        const rectMain = mainImage.getBoundingClientRect();
        const rectChoice = image.getBoundingClientRect();
        const offsetX = rectMain.left - rectChoice.left * 1.85;
        const offsetY = rectMain.top - rectChoice.top;
        const scaleX = 2.1;
        const scaleY = 2.1;
        image.style.position = '';
        image.style.zIndex = '999';
        if (image.id == 'choice1') {
            image.style.animation = 'left-select 1s linear forwards';
        } else {
            image.style.animation = 'right-select 1s linear forwards';
        }

        setTimeout(() => {
            image.style.zIndex = '999';
            console.log($('.correct-image-container').html(`<img class="correct-image" src="${image.src}"/>`))
            console.log(image.src.split('/'))
            $('#myModal').modal('show');

            // const popup = document.getElementById('popup');
            // popup.classList.add('show');
            // overlay.style.display = 'flex';
            // nextButton.style.display = 'block';
        }, 1000);
    }

    function checkChoice(image) {
        if (image.src === mainImage.src) {
            correctSound.play();
            score++;
            scoreDisplay.textContent = score;
            // image.classList.add('shake');
            setTimeout(() => {
                // image.classList.remove('shake');
                animateImage(image);
            }, 500);
        } else {
            incorrectSound.play();
            // image.classList.add('shake');
            image.style.animation = 'shake 0.5s linear forwards'
            console.log(image.id)
            setTimeout(() => {
                // image.classList.remove('shake')
                image.style.animation = 'none'; // 取消动画以便重置位置
                image.style.transform = 'translate(0, 0)';
            }, 1000);
        }
    }

    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    choice1.addEventListener('click', () => checkChoice(choice1));
    choice2.addEventListener('click', () => checkChoice(choice2));

    nextButton.addEventListener('click', () => {
        currentLevel++;
        if (currentLevel < levels.length) {
            loadLevel(currentLevel);
            $('#myModal').modal('hide');

        } else {

            $('#myModal').modal('hide');
            $('#myModal2').modal('show');
            stopTimer();
            // Optionally, you can reset the game or show a summary here
            currentLevel = 0; // Reset to the first level or handle accordingly
            loadLevel(currentLevel);
        }
    });

    completeButton.addEventListener('click', ()=>{
        window.location.href = '../../index.html'
    })

    // Initialize game
    loadLevel(currentLevel);
    startTimer(); // Start the timer when the game starts
});
