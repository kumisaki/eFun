let currentIndex = 1;
const cards = document.querySelectorAll('.card');
// const audio = document.getElementById('audio');
// const playPauseButton = document.getElementById('playPauseButton');
// const progressBar = document.getElementById('progress');

function updateCards() {
    cards.forEach((card, index) => {
        // console.log(card, index)
        card.style.transition = 'transform 0.3s, opacity 0.3s';
        if (index === currentIndex) {
            // card.style.transform = 'translateX(0px) scale(1)';
            card.style.transform = 'translateX(0px) scale(1)';
            card.style.zIndex = '3';
            card.style.opacity = '1';
            // audio.src = card.getAttribute('data-song');
            // audio.currentTime = 0;
            // progressBar.style.width = '0%';
            // audio.pause();
            // playPauseButton.textContent = 'Play';
        } else if (index === currentIndex - 1) {
            // card.style.transform = 'translateX(-110px) scale(0.8)';
            card.style.transform = 'translateX(-220px) scale(0.8)';
            card.style.zIndex = '2';
            card.style.opacity = '0.8';
        } else if (index === currentIndex + 1) {
            card.style.transform = 'translateX(220px) scale(0.8)';
            card.style.zIndex = '2';
            card.style.opacity = '0.8';
        } else if (index === currentIndex - 2) {
            card.style.transform = 'translateX(-440px) scale(0.6)';
            card.style.zIndex = '1';
            card.style.opacity = '0.6';
        } else if (index === currentIndex + 2) {
            card.style.transform = 'translateX(440px) scale(0.6)';
            card.style.zIndex = '1';
            card.style.opacity = '0.6';
        } else {
            card.style.transform = 'translateX(-999px) scale(0.6)';
            card.style.opacity = '0';
        }
    });
}

function nextCard() {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        updateCards();
    }
}

function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCards();
    }
}

function selectCard(index) {
    currentIndex = index;
    updateCards();
}

function checkAndRedirect(card, index) {
    switch (currentIndex+1) {
        case 1:
            practice = 'plane';
            break;
        case 2:
            practice = 'climb';
            break;
        case 3:
            practice = 'fish';
            break;
        default:
    }

    if (index === currentIndex) {
        window.location.href = `./practices/pronounce-practice-${practice}.html`;
    }
}

cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        checkAndRedirect(card, index);
        selectCard(index);
    });
});

// function togglePlayPause() {
//     if (audio.paused) {
//         audio.play();
//         playPauseButton.textContent = 'Pause';
//     } else {
//         audio.pause();
//         playPauseButton.textContent = 'Play';
//     }
// }

// audio.addEventListener('timeupdate', () => {
//     const progress = (audio.currentTime / audio.duration) * 100;
//     progressBar.style.width = progress + '%';
// });

cards.forEach((card, index) => {
    card.addEventListener('click', () => selectCard(index));
});

let startX;

document.querySelector('.carousel').addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchmove', (e) => {
    let touch = e.touches[0];
    let change = startX - touch.clientX;
    if (change > 50) {
        nextCard();
        startX = touch.clientX;
    } else if (change < -50) {
        previousCard();
        startX = touch.clientX;
    }
});

document.querySelector('.carousel').addEventListener('mousedown', (e) => {
    startX = e.clientX;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    let change = startX - e.clientX;
    if (change > 50) {
        nextCard();
        startX = e.clientX;
    } else if (change < -50) {
        previousCard();
        startX = e.clientX;
    }
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

updateCards();