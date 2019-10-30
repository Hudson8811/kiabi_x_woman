$(document).ready(function() {

    $('.marquee').marquee({
        duration: 15000,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'left',
        duplicated: true,
        startVisible:true

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
            if (c<=0){
                testEnd();
            }
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

    currentQuestion = 1;
    countQuestions = 1;
    quests = '';

    function testStart() {
        $.getJSON('test.json', function(data) {
            quests = data;
            countQuestions = quests.test.length;
            $('#current').html(currentQuestion);

            questId = quests.test[0].id;
            var quest = quests.test[0].quest;
            $('.question .text').html(quest);
        });
        timer();
    }
    
    function nextQuest() {
        currentQuestion++;
        if (currentQuestion <= countQuestions){
            $('#current').html(currentQuestion);
            var quest = quests.test[currentQuestion-1].quest;
            $('.question .text').html(quest);
        } else {
            testEnd();
        }
    }

    $('.step-3 .btns button').click(function () {
        var ans = 0;
        if ($(this).hasClass('no-btn')){
            ans = 0;
        } else {
            ans = 1;
        }
        nextQuest();
    });

    function testEnd() {
        $('.step-3').fadeOut(100,function () {
            $('.step-4').fadeIn(100, function () {
                $('#getScore').click(function () {
                    $('.step-4').fadeOut(300,function () {
                        $('.step-5').fadeIn(300, function (){
                            $('.pagi a').click(function () {
                                goPage(this);
                            });
                        });
                    });
                });
            });
        });
    }

    function goPage(elem){

    }


    function endCountdown() {
        $('.step-2').fadeOut(100,function () {
           $('.step-3').css("display", "flex").hide().fadeIn(100, function () {
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
        $('html,body').animate({
                scrollTop: $('.section-2').offset().top
            }, 500
        );
        $('.step-1').fadeOut(500,function () {
            $('.steps').fadeIn(500);
            timer3 = setInterval(function() { handleTimer(count); }, 1000);
        });
    });

    $('.to-top').click(function () {
        event.preventDefault();
        $('html,body').animate({
                scrollTop: 0
            }, 500
        );
    });
});




$(window).on('load', function() {
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
