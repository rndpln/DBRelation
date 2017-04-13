var SSEchannel = require('sse-channel');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var db = require('mongoose');
    db.connect('mongodb://127.0.0.1/front_kiosk');

var dataChannel = new SSEchannel();

var app = express();

var DoorUser = require('./models/DoorUser');

var areas_arr = [
    'Wood Shop',
    'Metal Shop',
    'Welding',
    'Automotive',
    'Machine Shop',
    'Textiles',
    '3D Printing',
    'Social',
    'Office',
    'Events/Classroom',
    'Laser Cutter',
    'Electronics',
    'Plasma Cutter',
    'Arts/Crafts'
];

app.get('/ping/:name/:auth', function(req, res){
      dataChannel.send(JSON.stringify(req.params));
      res.send('done.');
});

app.get('/thank-you', function(req, res, next){
    user_obj = {};
    res.render('thank-you');
});

app.get('/event/', function(req, res){
    dataChannel.addClient(req, res);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var fs = require('fs');
var ImageNames = [];
fs.readdir('./public/images/',function(e, file){
    ImageNames.push(file);
});

app.get('/', function(req, res, next) {
    res.render('index', {areas: areas_arr, images:ImageNames});
});

app.post('/', function(req, res, next) {
    DoorUser({
        name: req.body.user,
        date: req.body.date,
        resources: req.body['data[]']
    }).save(function(e){
        if(e){
            console.log(e);
        }else{
            console.log('posted.');
        }
    });
});

/*
app.get('/user', function(req, res, next){
    DoorUser.find(function(err, user){
        if(err) console.log(err);
        res.render('userList', {userLists:user});
    });
});
*/

app.get('/user/:username?', function(req, res, next){

    var offset = req.query.p || 0;

    var obj = {};
    if(req.params.username){
        obj = {name: req.params.username};
    }

    DoorUser.find({}).exec(function(err, user){
        console.log(err, user);
    });

    //console.log(obj.name);

    /*
    DoorUser.find(obj).exec(function(user, err){
        if(err) console.log(err);
        if(obj.name) res.render('user', {user: user});
        else res.render('userList',{userLists: user});
        console.log('===============');
        //console.log(user);
    });
*/

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
