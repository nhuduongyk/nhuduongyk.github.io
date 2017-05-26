$.noConflict();
var $ = jQuery;

$(document).ready(function() {
    var mainHeight = $(window).height() - 80;
    if ($(window).height() > $('footer').height()) {
        mainHeight = $(window).height() - $('footer').height();
    }
    $('.body-height').css('min-height', mainHeight);
})