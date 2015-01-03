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