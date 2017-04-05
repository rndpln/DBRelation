var source = new EventSource('/stream');

var user;
var date1 = new Date();
var _date1 = moment(date1);

document.onselectstart = function(){
    return false;
};

var to;
function clearOverlay(sec){
    if(user && user.name){
        $('#overlay').hide();

        if(!sec){
            sec = 121;
        }
        clearTimeout(to);
        to = setTimeout(function(){
            $('#overlay').show();
        }, 1000*sec);
    }
}

function setLeaveTime(h, m){
    _date2 = moment(_date1);
    _date2 = _date2.add(Number(h), 'hours').add(Number(m), 'minutes');
    $('.leaving').text(_date2.format("hh:mm A"));
}

source.addEventListener('message', function(e) {
    user = JSON.parse(e.data);
    if(user.name){
        skipTimer();
        _date1 = moment(new Date());
        $('.arrival').text(_date1.format("hh:mm A"));
        setLeaveTime($('#numInputHr').val(), $('#numInputMn').val());
        $('#user').text(user.name.replace(/\./g,' '));
        clearOverlay();
    }
});

source.addEventListener('open', function(e) { });

source.addEventListener('error', function(e) {
    if (e.target.readyState == EventSource.CLOSED) {
        console.log('disconnected...');
    }
    else if (e.target.readyState == EventSource.CONNECTING) {
        console.log('connecting...');
    }
}, false);

var skTimer;
function skip(){
    $.fn.post();
}

var skipScreen = true;
function skipTimer(){
    var skipval = 100;
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
                data: post_arr,
                enter_date: date1
            });
            window.location.replace("thank-you");
        }
    };

});
