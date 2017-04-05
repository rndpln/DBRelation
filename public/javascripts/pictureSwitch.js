/**
 * Created by Denny on 3/17/2017.
 */

var i = 0;

console.log(x, x.length);
$(document).ready(function(){
    var picArr = $('.picture');
    $(picArr[0]).css({'backgroundImage': 'url('+x[i].images[1].source+')'})
    $('#title').text(x[i].name);
    if(x[i].comments){
        var rand = Math.floor(Math.random()*x[i].comments.data.length);
        //$('#comment.from').text( x[i].comments.data[rand].from.name );
        $('#comment.message').text( x[i].comments.data[rand].message );
    }
    console.log($('#comment').width());
    $(picArr[1]).css({'backgroundImage': 'url('+x[i+1].images[1].source+')'});
    $('#comment').css({'left':($(document).width()/2)-($('#comment').width()/2)+"px"});

    $(document).on('keydown', function(){
        if(i < x.length-3){
            $('#upload_date').text(moment(x[i+2].created_time).format('hh:mm:ss A YYYY/MM/DD'));
            $('#author').text('uploaded by:'+ x[i].from.name);

            if(x[i].comments){
                TweenLite.to($('#comment'),1,{opacity: 0, bottom: '20px', onComplete:function(){
                    $('#comment').css({'bottom': '10px', opacity: 1});
                }})
                var rand = Math.floor(Math.random()*x[i].comments.data.length);
                $('.from').text( x[i].comments.data[rand].from.name );
                $('.message').text( x[i].comments.data[rand].message );
                $('.userProfilePic').attr('src', 'https://graph.facebook.com/'+x[i].comments.data[rand].from.id+'/picture');
                //console.log(x[i].comments.data[rand].message,x[i].comments.data[rand].from.id, rand);
            }else{
                $('#comment').css({opacity: 0});
                $('.from').text('');
                $('.userProfilePic').attr('src', '');
                $('.message').text('');
            }

            if(x[i+2].name){
                $('#title').text(x[i+2].name);
            }else{
                $('#title').text('');
            }

            TweenLite.to($('#upload_date'),.3,{opacity:0, right:"-30px"})
            TweenLite.to($('#author'),.3,{opacity:0, left:"-30px"})
            var picArr = $('.picture');
            TweenLite.to(picArr[1], 1, {opacity: 0, onComplete: function(){
                $(picArr[1]).insertBefore(picArr[0]);
                $(picArr[1]).css({'backgroundImage': 'url('+x[i+1].images[1].source+')'})
                $('#author').css({'left': '10px'});
                $('#upload_date').css({'right': '10px'});
                TweenLite.to($('#author'),.3,{opacity:1});
                TweenLite.to($('#upload_date'),.3,{opacity:1});
            }});
            TweenLite.to(picArr[0], 1, {opacity: 1});
            i++;
        }else{
            i = 0;
            $(picArr[1]).css({'backgroundImage': 'url('+x[i].images[1].source+')'});
        }

   });
});