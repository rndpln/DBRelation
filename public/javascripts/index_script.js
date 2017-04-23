var pushArr = [];
var liArr ="";
var user = {};

var skTimer;
function skip(){
    $.fn.post();
}

var to;
var skiperVal = 30;
var skipScreen = true;
function skipTimer(){
    var skipval = skiperVal;
    var elbtn = document.getElementById('skip');
    var el = document.getElementById('timer');
    clearInterval(skTimer);
    var i = skipval;
    skTimer = setInterval(function(){
        if(skipScreen){
            if(i < 1){
                clearInterval(skTimer);
                i = skipval;
                skip();
            }else{
                i--;
                if(i%2){
                    elbtn.style.border = "#FFF 3px solid";
                } else {
                    elbtn.style.border = "#F00 3px solid";
                }
                el.innerHTML = i;
            }
        }else{
            clearInterval(skTimer);
            el.innerHTML = "";
            elbtn.style.border = "#300 3px solid";
        }
    },1000);
}

function clearOverlay(sec) {
    if (user && user.name) {
        $('#overlay').hide();

        if (!sec) {
            sec = skiperVal;
        }
        clearTimeout(to);
        to = setTimeout(function () {
            $('#overlay').show();
        }, 1000 * sec);
    }
};

var _date1 = new Date();

var es = new EventSource("/event");
es.onmessage = function(e) {
    skipTimer();
    user = JSON.parse(e.data);
    _date_moment = moment(_date1);
    $('.arrival').text(_date_moment.format("hh:mm A"));
    $('#user').text(user.name.replace(/\./g,' '));
    $('#callout').show();
    if(user.org){
        $('#user').append(' ('+user.org+')');
        $('#callout').hide();
    }
    clearOverlay();
}


$(document).ready(function(){

    $('.areaBtn').click(function(){
        clearOverlay(40);
        skipScreen = false;
        $(this).toggleClass('selected');
    });

    $('#numInputHr').on('change', function(e){
        skipScreen = false;
        setLeaveTime($('#numInputHr').val(), $('#numInputMn').val());
        clearOverlay(40);
    });

    $('#numInputMn').on('change', function(e){
        skipScreen = false;
        setLeaveTime($('#numInputHr').val(), $('#numInputMn').val());
        clearOverlay(40);
    });

    $('#overlay').on('mousedown', function(){
        clearOverlay();
    });

    $('#skip').click(function(){
        if(user && user.name) {
            skip();
        }
    });

    $('#submit').click(function(){
        var selected_arr = $('.selected');
        var post_arr = [];
        selected_arr.each(function(i, idx){
            post_arr.push($(this).text());
        });

        $.fn.post(post_arr);
    });

    $.fn.post = function(post_arr){
        if(user && user.name){
            $.post('/', {
                user: user.name,
                date: _date1,
                data: post_arr
            });
            window.location.replace("thank-you");
        }
    };

});