var mongoose = require('mongoose');
var db = mongoose.connection;
var usermodel = [];

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    admin: Boolean,
    name: {
        first: String,
        last: { type: String, trim: true }
    }
});
var Users = mongoose.model('Users', userSchema);

usermodel.createUserSchema = function () {
    console.log('Initializing Users');
    Users.find({}).exec(function(err, result) {
        if (!err) {
            if (result.length === 0) {
                console.log('creating johndoe admin');
                var johndoe = new Users ({
                    username: 'JohnDoe',
                    password: '12345',
                    salt: '',
                    admin: true,
                    name: { first: 'John', last: '  Doe   ' }
                });
                // Saving it to the database.
                johndoe.save(function (err) {if (err) console.log ('Error on save!')});
            }
            // handle result
        } else {
            // error handling
            console.log('error querying admins');
        };
    });
}

usermodel.createNewUser = function(username, password, salt, firstName, lastName) {
    console.log('creating user: ' + username);
    var newUser = new Users ({
        username: username,
        password: password,
        salt: salt,
        admin: true,
        name: { first: firstName, last: lastName },
        admin: false
    });
    newUser.save(function (err) {
        if (err) {
            console.log ('Error on save!');
            console.log ('err = ' + err);
            return false;
        } else {
            // If it works, set the header so the address bar doesn't still say /addpost
            console.log('returning true');
            return true;
        }
    });
    return true;
}

usermodel.getAllUsers = function () {
    console.log('Getting All Users');
    Users.find({}).exec(function(err, result) {
        if (!err) {
            usermodel.allUsers = result;
        } else {
            // error handling
            console.log('error querying users');
        };
    });
}();

module.exports = usermodel;