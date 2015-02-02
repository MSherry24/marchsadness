// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User = require('../models/usermodel');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);
                        if (newUser.local.email === 'mikesherry24@gmail.com') {
                            newUser.isAdmin = true;
                        } else {
                            newUser.isAdmin = false;
                        }
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.okToEmail = req.body.oktoemail === "on";

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));
};





///**
// * Created by mikesherry24 on 10/7/14.
// */
//exports.normal_auth = function (req, res, next) {
//    "use strict";
//    console.log('authorizing');
//    console.log('req.user = ' + req.user);
//    if (req.user) {
//        console.log('req.user.is_admin = ' + req.user.is_admin);
//    }
//    if (req.user && req.user.is_admin) {
//        console.log('authorization success');
//        return next();
//    }
//    console.log('authorization fail');
//    return res.redirect('/admin/login');
//};
//
//exports.serialize_user = function (user, done) {
//    "use strict";
//    console.log('serializeUser');
//    console.log('user keys = ' + Object.keys(user));
//    done(null, user._id);
//};
//
//exports.deserialize_user = function (id, done) {
//    "use strict";
//    // query the current user from database
//    var usermodel, Users;
//    usermodel = require('./models/usermodel');
//    console.log('deserializeUser');
//    Users = usermodel.users;
//    Users.findOne({_id: id}, function (err, user) {
//        if (err) {
//            console.log('err = ' + err);
//            return done(err);
//        }
//        console.log('user = ' + Object.keys(user));
//        console.log(' user.username = ' + user.username);
//        return done(null, user);
//    });
//};
//
//exports.getLocalStrategy = function (passport, LocalStrategy) {
//    return new LocalStrategy({
//          // set the field name here
//          usernameField: 'username',
//          passwordField: 'password'
//      },
//      function (username, password, done) {
//          "use strict";
//          /* get the username and password from the input arguments of the function */
//
//          // query the user from the database
//          // don't care the way I query from database, you can use
//          // any method to query the user from database
//          console.log('passport authenticate');
//          console.log('password = ' + password);
//          Users.findOne({username: username }, function (err, user) {
//              console.log('user = ' + user);
//              if (err) {
//                  console.log('err = ' + err);
//                  return done(err);
//              }
//              if (!user) {
//                  // if the user is not exist
//                  console.log('user does not exist');
//                  return done(null, false, {message: "The user is not exist"});
//              }
//              if (user) {
//                  var userPassword = crypto.getPassword(password, user.salt).toString('hex');
//                  console.log('userPassword = ' + userPassword);
//                  console.log('user.password = ' + user.password);
//                  if (userPassword !== user.password) {
//                      // if password does not match
//                      console.log('bad password');
//                      return done(null, false, {message: "Wrong password"});
//                  }
//                  // if everything is OK, return null as the error
//                  // and the authenticated user
//                  console.log('Success!');
//                  console.log('user = ' + Object.keys(user));
//                  return done(null, user);
//              }
//          });
//      });
//};