function Color(){
    var self = this;

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;

    this.offset = 255;

    this.rand =  function(_offset){
        var offset = _offset || 255;
        self.r = Math.floor(Math.random()*offset);
        self.g = Math.floor(Math.random()*offset);
        self.b = Math.floor(Math.random()*offset);
        return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }

    return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
}

$(document).ready(function() {

    var ix = 0;
    var pushX = 0;
    var iy = 0;
    var pushY = 0;
    var moveForward = 0;
    var moveDown = 0;
    var c = new Color();

    var num = 0;

    imageArray.forEach(function(e, idx){
        var el = $('<div>', {class:"overImage"});
            el.css({'background-image': 'url(/images/'+e+')', 'zIndex': 9997-idx, 'left':'-40px'});
        if(idx === 0){
            el.css({'opacity':1, 'left': '0px'});
        }
        $('#overlay').append(el);
    });

    var i = 0;
    var i2 = 1;



    var s = setInterval(function(){
        ix+= pushX;
        iy+= pushY;
        var el = $('#welcomeFloater');

        if(window.innerHeight - (iy+el.height()) <1){
            moveDown = 0;

            var el = $('.overImage');

            TweenLite.to(el[i],.6,{opacity:0, left:"+40px", onComplete:test});
            TweenLite.to($('#overlay'),1, {'background-color': c.rand(200)});

            if(i<el.length-1){
                TweenLite.to(el[i+1],.6,{opacity:1, left:"0px"});
            }

            function test(){
                $(el[i]).css({'left':'-40px'});
                if(i<el.length-1){
                    i++;
                }else{
                    i = 0;
                }
            }
        }

        if(iy<0 &&!moveDown){
            moveDown = 1;
            //var image = '/images/'+imageArray[Math.floor(Math.random()*imageArray.length)];
            TweenLite.to($('#overlay'),2, {'background-color': c.rand(200)});
        }
        if(window.innerWidth - (ix+el.width()) < 1){
            moveForward = 0;
            TweenLite.to($('#overlay'),2, {'background-color': c.rand(100)});
        }
        if(ix < 0 && !moveForward){
            moveForward = 1;
            TweenLite.to($('#overlay'),2, {'background-color': c.rand(250)});
        }

        if(moveForward){
            pushX = 1;
        }else{
            pushX = -1;
        }

        if(moveDown){
            pushY = 1;
        }else{
            pushY = -1;
        }

        $('#welcomeFloater').css({left:ix, top:iy});

    },10);
});