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

    function timer() {
        var end,
            now=Date.now,
            raf=window.requestAnimationFrame,
            duration=60000,//MS
            out=document.getElementById('timer');
        function displayTime(){
            var c=end-now();
            out.textContent=ms2TimeString(c>0?(raf(displayTime),c):0);
        }
        function go(){
            end=now()+duration;
            raf(displayTime);
        }
        function ms2TimeString(a,k,s,m,h){
            return k=a%1e2,
                s=a/1e3%60|0,
                m=a/6e4%60|0,
                h=a/36e5%24|0,
            (h?(h<10?'0'+h:h)+':':'')+
            (m<10?0:'')+m+':'+
            (s<10?0:'')+s+':'+
            (k<10?0:'')+k
        }
        go();
    }

    function testStart() {
        timer();
    }


    function endCountdown() {
        $('.step-2').fadeOut(300,function () {
           $('.step-3').css("display", "flex").hide().fadeIn(300, function () {
               testStart();
           });
        });
    }
    function handleTimer() {
        if(count === 0) {
            clearInterval(timer3);
            console.log(count);
            endCountdown();
        } else {
            $('.countdown').html(count);
            count--;
        }
    }
    var count = 3;


    $('.step-1 .btn-light').click(function () {
        event.preventDefault();
        $('.step-1').fadeOut(500,function () {
            $('.steps').fadeIn(500);
            timer3 = setInterval(function() { handleTimer(count); }, 1000);
        });
    });
});



