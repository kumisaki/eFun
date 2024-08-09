document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '../../index.html';
});
$(document).ready(function () {
    $('.animal').click(function (e) {
        var $animal = $(this);
        var animalName = $animal.data('name');
        var $popup = $('#popup');

        // set up animal position to avoid the popup overflow the window
        var offset = $animal.offset();
        var animalFarmOffset = $('#animalFarm').offset();
        var animalFarmWidth = $('#animalFarm').width();
        var animalFarmHeight = $('#animalFarm').height();
        var popupWidth = $popup.width();
        var popupHeight = $popup.height();
        var sound = $('#pronounce');

        var top = offset.top;
        var left = offset.left;

        if (offset.top - animalFarmOffset.top < animalFarmHeight / 2) {
            top += $animal.height();
        } else {
            top -= popupHeight;
        }

        if (offset.left - animalFarmOffset.left < animalFarmWidth / 2) {
            left += $animal.width();
        } else {
            left -= popupWidth;
        }

        // Update popup content
        $popup.html(`<img src="../../assets/img/${animalName}.png" 
            alt="${animalName}" style="height:232px;">`);
        sound.attr('src', `../../assets/sound/${animalName}.mp3`);
        sound.get(0).play()
        $popup.css({
            top: top,
            left: left
        }).fadeIn();
    });

    // Hide popup when clicking outside
    $(document).click(function (e) {
        if (!$(e.target).closest('.animal, #popup').length) {
            $('#popup').fadeOut();
        }
    });
});