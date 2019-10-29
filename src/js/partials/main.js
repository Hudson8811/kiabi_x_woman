$(document).ready(function() {

    $('.marquee').marquee({
        duration: 15000,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        startVisible:true

    });

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        releaseOnEdges: true,
        touchReleaseOnEdges: true,
        navigation: {
            nextEl: '.button-next',
            prevEl: '.button-prev',
        },
        on:{
            reachBeginning: function () {
            },
            reachEnd: function () {
            },
            fromEdge: function () {
            },
            resize: function () {
            }
        }
    });

});



