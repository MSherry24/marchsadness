var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var flash = require('connect-flash');

//DB Code
// mongo start code - mongod.exe --config e:\mongodb\mongo.config
// mongo start code - mongod.exe --config C:\Users\msherry\Documents\mongodb\mongo.config
var mongoose = require('./models/db');
//var userModel = require('./models/usermodel');

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('./custom_modules/crypto_methods');
var authMethods = require('./custom_modules/authorization_methods')(passport);
//passport.use(authMethods.getLocalStrategy(passport, LocalStrategy));
//passport.serializeUser(authMethods.serialize_user);
//passport.deserializeUser(authMethods.deserialize_user);

//Routes
var routes = require('./routes/index');
var marchSadness = require('./routes/marchsadness');
var admin = require('./routes/admin');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('2478442F-889A-F90F-66A3BCC1D3DC'));
app.use(session({secret: 'EE42A4BD-58C6-513D-7A4BD2F6FE53'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    "use strict";
    req.db = mongoose.connections[0];
    next();
});
app.use(function (req, res, next) {
    "use strict";
    req.passport = passport;
    next();
});

app.use('/', routes);
app.use('/marchsadness', marchSadness);
app.use('/admin', admin);
app.use('/users', users);

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

var server = http.createServer(app);
var boot = function() {
    server.listen(app.get('port'), function() {
        console.info('Express server listening on port ' + app.get('port'));
    });
};
var shutdown = function() {
    server.close();
};

if (require.main === module) {
    boot();
}
else {
    console.info('Running app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}


module.exports = app;
