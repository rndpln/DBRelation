var SSEchannel = require('sse-channel');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var moment = require('moment');

var index = require('./routes/index');
var users = require('./routes/users');

var db = require('mongoose');
    db.connect('mongodb://127.0.0.1/front_kiosk');

var dataChannel = new SSEchannel();

var app = express();

var DoorUser = require('./models/DoorUser');

var BAE_employees = [
    'Henry.Karwacki',
    'Carl.Nivens',
    'Jeremy.Gibson',
    'Adam.Sayer',
    'Benjamin.Campbell',
    'Eric.Gausch',
    'Charles.Bobbins',
    'Melissa.Trepanier',
    'Kevin.Peters',
    'Michael.Shaw',
    'David.Dainis',
    'William.Forsling',
    'Christopher.Cole',
    'Timothy.DelSignore',
    'Zack.Maynard',
    'Brian.Smith',
    'Peter.MBauerIII',
    'Daniel.Magarrell',
    'Thomas.Collins',
    'Peter.Webster',
    'PJ.Guill',
    'Alain.Larouche'
];

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
      //hacky way of determining if an employee is from BAE. TODO: Use a USER database and add an ORG field.
      if(BAE_employees.indexOf(req.params.name) >= 0){
          req.params.org = "BAE";
      }

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

app.get('/user/:username?', function(req, res, next){

    var off = req.query.p || 0;
    var date = req.query.d;

    var lim = 50;
    var single = false;

    var obj = {};
    if(req.params.username){
        obj.name = req.params.username;
        single = true;
    }

    if(req.query.f === "BAE"){
        obj.name = {$in: BAE_employees};
    }

    if(date){
        obj.date = {$gte: moment(date).valueOf(), $lte: moment(date).add(1, 'day').valueOf()};
    }else{
        date = moment().format('Y-M-D');
    }

    DoorUser.find(obj, function(err, _user){
        var count = _user.length;
        var pagCnt = count / lim;

        res.render('user',{user:_user, single:single, cnt:pagCnt, date:date})

    }).limit(lim).skip(off*lim);

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
