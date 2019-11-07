$(document).ready(function() {

    $('.to-play .btn-light').hover(function () {
       $('.auth-block').css("display", "flex").hide();
       $(this).fadeOut(300,function () {
           $('.auth-block').fadeIn(300);
       });
    });


    $('.marquee').marquee({
        duration: 15000,
        gap: 0,
        delayBeforeStart: 0,
        direction: 'right',
        duplicated: true,
        startVisible:true
    });

    $(window).resize(function () {
        $('.marquee').marquee('destroy').marquee({
            duration: 15000,
            gap: 0,
            delayBeforeStart: 0,
            direction: 'right',
            duplicated: true,
            startVisible:true
        });
    });

    end = 0;

    function timer() {
        var now=Date.now,
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

    function getData(social) {
        $.ajax({
            type: "POST",
            url: "/get_test/",
            data: { social : social },
            success: function(data) {
                if (data.length){
                    var parse = JSON.parse(data);
                    quests = parse;
                    $('html,body').animate({
                            scrollTop: $('.section-2').offset().top
                        }, 500
                    );
                    $('.step-1').fadeOut(500,function () {
                        $('.steps .box-solid .inner-box > div').hide();
                        $('.step-2').show();
                        $('.steps').fadeIn(500);
                        $('.step-2 .countdown, .question .text').html('');
                        $('#timer').html('01:00:00');
                        $('#current').html('1');
                        $('.step-4').removeClass('no-info');
                        $('.step-4 .no-block').html('');
                        count = 3;
                        currentQuestion = 1;
                        testResults =[];
                        timer3 = setInterval(function() { handleTimer(count); }, 1000);
                    });
                } else {
                    $('.to-play').html('');
                    if (social != ''){
                        $('.step-4 .no-block').html('<div class="noMore">Извините, но вы использовали эту попытку!</div>');
                        $('.step-4 .share').hide();
                        setTimeout(function () {
                            $('.step-4 .no-block').html('');
                            $('.step-4 .share').show();
                        }, 5000);
                    } else {
                        $('.step-4').addClass('no-info');
                        $('.step-4 .no-block').html('<div class="noMore">Вы уже проходили тест</div>');
                    }
                    $('.step-1').hide();
                    $('.steps').show();
                    $('.steps .box-solid .inner-box > div').hide();
                    $('.step-4').show();

                }
            },
            error: function () {
                alert('Ошибка запроса вопросов');
            }
        });
    }

    function testStart() {
        countQuestions = quests.test.length;
        $('#current').html(currentQuestion);

        //questId = quests.test[0].id;
        var quest = quests.test[0].quest;
        $('.question .text').html(quest);
        timer();
    }

    testEnded = 0;
    
    function nextQuest() {
        currentQuestion++;
        if (currentQuestion <= countQuestions){
            $('#current').html(currentQuestion);
            var quest = quests.test[currentQuestion-1].quest;
            $('.question .text').html(quest);
        } else {
            testEnded = 1;
            testEnd();
        }
    }

    testResults =[];

    $('.step-3 .btns button').click(function () {
        if (currentQuestion <= countQuestions) {
            if ($(this).hasClass('no-btn')) {
                testResults.push(1);
            } else {
                testResults.push(2);
            }
            nextQuest();
        }
    });

    $('.share .social-block .soc-link').click(function () {
        event.preventDefault();
        var social = $(this).data('share');
        getData(social);
    });

    function testEnd() {
        var now=Date.now,
            c = end - now();

        if (c < 0) c = 0;

        if (testEnded == 1) {
            $('.step-4 .title').html('Тест пройден');
        }

        var resultSend = JSON.stringify( testResults );
        $.ajax({
            type: "POST",
            url: "/save_result/",
            //отправка ответов и оставшегося времени в милиссекундах
            data: { ansver : resultSend, timer: c },
            success: function(data) {

                //ответ от сервера
                var parse = JSON.parse(data);
                var results = parse.results;
                var share = results[0].share;
                var info = results[1].info;
                reit = results[2].reit;

                //data на блок share
                $('.step-4 .social-block').attr('data-url', share[0].url);
                $('.step-4 .social-block').attr('data-image', results[0].image);
                $('.step-4 .social-block').attr('data-title', results[0].title);
                $('.step-4 .social-block').attr('data-description', results[0].description);

                //количество правильных
                var score = info[0].score;
                $('.step-4 .result .score').html(score);
                if (score == 1) $('.step-4 .result .text').html('правильный <br>ответ');
                if (score == 2 || score == 3 || score == 4) $('.step-4 .result .text').html('правильных <br>ответа');

                //позиция
                positionNum = info[0].position;
                $('.step-4 .position').html(positionNum);

                //таблица рейтинга
                countReit = reit.length;
                //пагинация
                pages = Math.ceil((countReit+1)/15);

                var goToPage = Math.ceil(positionNum/15);

                goPage(goToPage);

                if (pages > 1){
                    var pagiHtml = '';
                    pagiHtml = pagiHtml+ '<a href="javascript:;" class="arrow prev"></a>';

                    for (i = 1; i <= pages; i++) {
                        var active = '';
                        if (i == goToPage) active = 'active';
                        pagiHtml = pagiHtml+ '<a href="javascript:;" class="number '+active+'" data-page="'+i+'">'+i+'</a>';
                    }
                    pagiHtml = pagiHtml+ '<a href="javascript:;" class="arrow next"></a>';
                }
                $('.step-5 .pagi').html(pagiHtml);
            }
        });



        $('.step-3').fadeOut(100,function () {
            $('.step-4').fadeIn(100, function () {
                $('#getScore').click(function () {

                    $('.step-4').fadeOut(300,function () {
                        $('.step-5').fadeIn(300, function (){
                            $('.pagi a').click(function () {
                                var dataPage = 1;
                                if (!$(this).hasClass('active') && $(this).hasClass('number')){
                                    $(this).addClass('active').siblings().removeClass('active');
                                    dataPage = $(this).data('page');
                                    goPage(dataPage);
                                }
                                if ($(this).hasClass('arrow')){
                                    if ($(this).hasClass('prev')){
                                        if ($('.pagi a.number.active').data('page') != 1){
                                            $('.pagi a.number.active').prev().addClass('active').siblings().removeClass('active');
                                            dataPage = $('.pagi a.number.active').data('page');
                                            goPage(dataPage);
                                        }
                                    } else {
                                        if ($('.pagi a.number.active').data('page') != pages){
                                            $('.pagi a.number.active').next().addClass('active').siblings().removeClass('active');
                                            dataPage = $('.pagi a.number.active').data('page');
                                            goPage(dataPage);
                                        }
                                    }
                                }
                            });
                            $('#close-reit').click(function () {
                                $('.step-5').fadeOut(300,function () {
                                    $('.step-4').fadeIn(300);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    function goPage(page){
        var outHtml = '<table><tr><th>место</th><th>имя и фамилия</th><th>время</th><th>правильные <br>ответы</th></tr>';
        var targetReit = (page * 15);
        var startReit = (page * 15) - 15;
        if (countReit < targetReit) {
            targetReit = countReit;
        }
        for (i = startReit; i < targetReit; i++) {
            var positionClass = '';
            if (positionNum == (i+1)) positionClass = 'class="current"';
            outHtml = outHtml+ '<tr '+positionClass+'><td>'+(i+1)+'</td><td>'+reit[i].name+'</td><td>'+reit[i].time+'</td><td>'+reit[i].correct+'</td></tr>';
        }
        outHtml = outHtml+ '</table>';
        $('.step-5 .table').html(outHtml);
        $('html,body').animate({
                scrollTop: $('.section-2').offset().top
            }, 300
        );
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
            endCountdown();
        } else {
            $('.countdown').html(count);
            count--;
        }
    }
    var count = 3;


    $('.step-1 .btn-light').click(function () {
        event.preventDefault();
    });

    $('.to-top').click(function () {
        event.preventDefault();
        $('html,body').animate({
                scrollTop: 0
            }, 500
        );
    });


    function getUser() {
        $.ajax({
            type: "POST",
            url: "/get_user/",
            data: '',
            success: function(returnData) {
                if (returnData.length) {
                    var parse = JSON.parse(returnData);
                    if (parse.result == 1) {
                        var share = parse.share;
                        $('.step-4 .social-block').attr('data-url', share.url);
                        $('.step-4 .social-block').attr('data-image', share.image);
                        $('.step-4 .social-block').attr('data-title', share.title);
                        $('.step-4 .social-block').attr('data-description', share.description);

                        $('.to-play').html('');
                        $('.step-4').addClass('no-info');
                        $('.step-4 .no-block').html('<div class="noMore">Вы уже проходили тест</div>');
                        $('.step-1').hide();
                        $('.steps').show();
                        $('.steps .box-solid .inner-box > div').hide();
                        $('.step-4').show();
                    }
                }
            },
            error: function () {
                alert('Ошибка проверки авторизации');
            }
        });
    }

    getUser();

    window.auth = function (data) {
        $.ajax({
            type: "POST",
            url: "/authorize/",
            data: data,
            success: function(data) {
                var parse = JSON.parse(data);
                if (parse.result == 1) {
                    getData('');
                }
            },
            error: function () {
                alert('Ошибка авторизации для прохождения теста');
            }
        });
    }

});




$(window).on('load', function() {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        releaseOnEdges: true,
        touchReleaseOnEdges: true,
        speed: 800,
        navigation: {
            nextEl: '.button-next',
            prevEl: '.button-prev',
        },
        breakpoints: {
            0: {
                autoHeight: true,
                loop: true
            },
            1024: {
                autoHeight: false,
                loop: false
            },
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


