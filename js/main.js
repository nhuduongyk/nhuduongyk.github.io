$.noConflict();
var $ = jQuery;

$(document).ready(function() {
    var mainHeight = $(window).height() - 80;
    if ($(window).height() > $('footer').height()) {
        mainHeight = $(window).height() - $('footer').height();
    }
    $('.body-height').css('min-height', mainHeight);

    $('.mini-submenu').on('click', function() {
        $(this).next('.list-group').toggle('slide');
        $('.mini-submenu').hide();
    })

    $('#slide-submenu').on('click', function() {
        $(this).closest('.list-group').fadeOut('slide', function() {
            $('.mini-submenu').fadeIn();
        });

    });



})