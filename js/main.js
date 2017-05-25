$.noConflict();
jQuery(document).ready(function() {
    jQuery('.fliper-btn').click(function() {
        jQuery('.flip').find('.card').toggleClass('flipped');
    });
})