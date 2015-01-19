/**
 * Created by mikesherry24 on 10/7/14.
 */
exports.normal_auth = function (req, res, next) {
    "use strict";
    console.log('authorizing');
    console.log('req.user = ' + req.user);
    if (req.user) {
        console.log('req.user.is_admin = ' + req.user.is_admin);
    }
    if (req.user && req.user.is_admin) {
        console.log('authorization success');
        return next();
    }
    console.log('authorization fail');
    return res.redirect('/admin/login');
};

exports.serialize_user = function (user, done) {
    "use strict";
    console.log('serializeUser');
    console.log('user keys = ' + Object.keys(user));
    done(null, user._id);
};

exports.deserialize_user = function (id, done) {
    "use strict";
    // query the current user from database
    var usermodel, Users;
    usermodel = require('./models/usermodel');
    console.log('deserializeUser');
    Users = usermodel.users;
    Users.findOne({_id: id}, function (err, user) {
        if (err) {
            console.log('err = ' + err);
            return done(err);
        }
        console.log('user = ' + Object.keys(user));
        console.log(' user.username = ' + user.username);
        return done(null, user);
    });
};

exports.getLocalStrategy = function (passport, LocalStrategy) {
    return new LocalStrategy({
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
      });
};