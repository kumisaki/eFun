document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '../../index.html';
});
$(document).ready(function () {
    $('.animal').click(function (e) {
        var $animal = $(this);
        var animalName = $animal.data('name');
        var $popup = $('#popup');
        var offset = $animal.offset();
        var animalFarmOffset = $('#animalFarm').offset();
        var animalFarmWidth = $('#animalFarm').width();
        var animalFarmHeight = $('#animalFarm').height();
        var popupWidth = $popup.width();
        var popupHeight = $popup.height();

        // Calculate position
        var top = offset.top;
        var left = offset.left;

        if (offset.top - animalFarmOffset.top < animalFarmHeight / 2) {
            // Animal is in the top half of the farm, show popup below
            top += $animal.height();
        } else {
            // Animal is in the bottom half of the farm, show popup above
            top -= popupHeight;
        }

        if (offset.left - animalFarmOffset.left < animalFarmWidth / 2) {
            // Animal is in the left half of the farm, show popup to the right
            left += $animal.width();
        } else {
            // Animal is in the right half of the farm, show popup to the left
            left -= popupWidth;
        }

        // Update popup content
        $popup.html('<img src="../../assets/img/' + animalName + '.png" alt="' + animalName + '" style="height:232px;">');

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