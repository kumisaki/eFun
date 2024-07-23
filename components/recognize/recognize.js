$(document).ready(function() {
    $('.animal').on('click', function(event) {
        var animalName = $(this).data('name');
        var offset = $(this).offset();
        var tooltip = $('#tooltip');

        tooltip.text(animalName)
               .css({
                   top: offset.top + 'px',
                   left: (offset.left + 60) + 'px'
               })
               .fadeIn(300);

        setTimeout(function() {
            tooltip.fadeOut(300);
        }, 2000);
    });
});
