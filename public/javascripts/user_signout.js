var date2 = new Date();
$(document).ready(function(){
    $('#signout').on('click', function(){
        var url = $(this).attr('href');
        $.post(url, {
            leave_date: date2
        });
    });
});
