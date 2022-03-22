(function ($) {
    'use strict';


    /* Window Load */
    $(window).on('load', function () {
        $('.loader').fadeOut(200);
        $('.line').addClass('active');
    });


    $("#cadastro-bt").click(function () {
        $("html").animate({ scrollTop: 0 }, "fast");
    });

    /*
        Smooth scroll functionality for anchor links (animates the scroll
        rather than a sudden jump in the page)
    */
    $('.js-anchor-link').click(function (e) {
        e.preventDefault();
        var target = $($(this).attr('href'));
        if (target.length) {
            var scrollTo = target.offset().top;
            $('body, html').animate({ scrollTop: scrollTo + 'px' }, 800);
        }
    });


    (function () {
        var header = document.querySelector(".header");

        var headroom = new Headroom(header, {
            tolerance: {
                down: 10,
                up: 20
            },
            offset: 15
        });
        headroom.init();
    })();


})(jQuery);


$("#simulador-range").ionRangeSlider({
    min: 5000,
    max: 600000,
    from: 240000,
    to: 4500,
    step: 5000,
    prefix: "R$ ",
    prettify: true,
    prettify_separator: ".",
    keyboard: true
});


/*=================================================================
    owlCarousel
===================================================================*/

function owlInitialize() {
    if ($(window).width() < 768) {
        $('.content-group').addClass("owl-carousel");
        $('.owl-carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 5,
            nav: true,
            dots: false
        });
    } else {
        $('.owl-carousel').owlCarousel('destroy');
        $('.content-group').removeClass("owl-carousel");
    }

    $('.table-result').owlCarousel({
        items: 1,
        margin: 0,
        stagePadding: 0,
        smartSpeed: 450,
        autoplay: false,
        nav: true,
        dots: false,
        loop: false,
        mouseDrag: true,
        lazyLoad: true,
        responsive: {
            991: {
                items: 1
            },
            992: {
                items: 4
            },
            1200: {
                items: 6
            }
        }
    });


    $('.select-product').owlCarousel({
        items: 2,
        margin: 0,
        stagePadding: 0,
        smartSpeed: 450,
        autoplay: false,
        nav: true,
        dots: false,
        loop: false,
        mouseDrag: true,
        lazyLoad: false,
        responsive: {
            0: {
                items: 2
            },
            768: {
                items: 3
            }
        }
    });
}


$(document).ready(function (e) {
    owlInitialize();
});
$(window).resize(function () {
    owlInitialize();
});


(function () {
    var docElem = document.documentElement;

    window.lazySizesConfig = window.lazySizesConfig || {};

    window.lazySizesConfig.loadMode = 1;

    //set expand to a higher value on larger displays
    window.lazySizesConfig.expand = Math.max(Math.min(docElem.clientWidth, docElem.clientHeight, 1222) - 1, 359);
    window.lazySizesConfig.expFactor = lazySizesConfig.expand < 380 ? 3 : 2;
})();



