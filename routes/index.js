var express = require('express');
var router = express.Router();
var passport = require('passport');
var msModel = require('../models/marchSadnessModel');
var blog = require('../models/blogModel');
var smtpTransport = require('nodemailer-smtp-transport');

router.get('/', function(req, res) {
    "use strict";
    msModel.UserTeam.find({}).sort({totalScore: -1}).limit(2).exec(function (err, topTeams) {
        if (err) {
            console.log(err);
        }
        blog.BlogPost.find({}).limit(5).sort({timestamp: -1}).exec(function (err, blogPosts) {
            if (err) {
                console.log(err);
            }
            res.render('marchsadness/marchsadnesshome',
                {
                    title: 'March Sadness',
                    user: req.user,
                    topTeams: topTeams,
                    blogPosts: blogPosts,
                    message: req.flash('TeamDoesNotExist')
                });
        });
    });
});

/* GET Contact page. */
router.get('/contact', function (req, res) {
    "use strict";
    res.render('contact', {
        user: req.user
    });
});

router.post('/contact', function (req, res) {
    "use strict";
    var nodemailer = require('nodemailer'),
        transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'failureleaguegame@gmail.com',
                pass: 'kyleorton'
            }
        }));
    transporter.sendMail({
        from: 'failureleaguegame+' + req.body.messageType + '@gmail.com',
        to: 'failureleaguegame+' + req.body.messageType + '@gmail.com',
        subject: 'Site Form ' + req.body.messageType,
        text: 'user Email: ' + req.body.userEmail + 'user message: ' + req.body.message
    });
    res.status(200).end();
});

module.exports = router;
