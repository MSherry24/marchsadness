/**
 * Created by mikesherry24 on 10/8/14.
 */
var crypto = require('crypto');

exports.createPassword = function (password) {
    "use strict";
    var passwordInfo = {};
    passwordInfo.salt = crypto.randomBytes(128).toString('base64');
    passwordInfo.hashedPassword = crypto.pbkdf2Sync(password, passwordInfo.salt, 10000, 512);
    return passwordInfo;
};

exports.getPassword = function (password, salt) {
    "use strict";
    return crypto.pbkdf2Sync(password, salt, 10000, 512);
};