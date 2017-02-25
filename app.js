var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


var routes = require('./routes/index');
var parts = require('./routes/parts');
var pick_lists = require('./routes/pick_lists');
var configs = require('./routes/configs');
var stores = require('./routes/stores');
var login = require('./routes/login');
var user = require('./models/User.js');

// Database
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGO_URL, {native_parser:true});

mongoose.connect(process.env.MONGO_URL, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var app  = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { debug: true })

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/Partfinder-Web/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});



var opts = {}
console.log(process.env.MONGO_URL);
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    user.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

app.use('/login', login);
app.use('/', routes);
// API need authtoken
app.all('*', passport.authenticate('jwt', { session: false }));

app.use('/parts', parts);
app.use('/pick_lists', pick_lists);
app.use('/configs', configs);
app.use('/stores', stores);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
