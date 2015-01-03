var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');

//DB Code
var mongoose = require('./models/db');
var usermodel, Users;
usermodel = require('./models/usermodel');
Users = usermodel.users;

//Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('./custom_modules/crypto_methods');

passport.use(new LocalStrategy({
        // set the field name here
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        "use strict";
        /* get the username and password from the input arguments of the function */

        // query the user from the database
        // don't care the way I query from database, you can use
        // any method to query the user from database
        console.log('passport authenticate');
        console.log('password = ' + password);
        Users.findOne({username: username }, function (err, user) {
            console.log('user = ' + user);
            if (err) {
                console.log('err = ' + err);
                return done(err);
            }
            if (!user) {
                // if the user is not exist
                console.log('user does not exist');
                return done(null, false, {message: "The user is not exist"});
            }
            if (user) {
                var userPassword = crypto.getPassword(password, user.salt).toString('hex');
                console.log('userPassword = ' + userPassword);
                console.log('user.password = ' + user.password);
                if (userPassword !== user.password) {
                    // if password does not match
                    console.log('bad password');
                    return done(null, false, {message: "Wrong password"});
                }
                // if everything is OK, return null as the error
                // and the authenticated user
                console.log('Success!');
                console.log('user = ' + Object.keys(user));
                return done(null, user);
            }
        });
    }));

passport.serializeUser(function (user, done) {
    "use strict";
    console.log('serializeUser');
    console.log('user keys = ' + Object.keys(user));
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    "use strict";
    // query the current user from database
    var usermodel, Users;
    usermodel = require('./models/usermodel');
    console.log('deserializeUser');
    Users = usermodel.users;
    Users.findOne({_id: id}, (function (err, user) {
        if (err) {
            console.log('err = ' + err);
            return done(err);
        }
        console.log('user = ' + Object.keys(user));
        console.log(' user.username = ' + user.username);
        return done(null, user);
        })
    );
});



//Routes
var routes = require('./routes/index');
var marchsadness = require('./routes/marchsadness');
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    "use strict";
    req.db = mongoose;
    next();
});
app.use(function (req, res, next) {
    "use strict";
    req.passport = passport;
    next();
});

app.use('/', routes);
app.use('/marchsadness', marchsadness);
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
}
var shutdown = function() {
    server.close();
}

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
