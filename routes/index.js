var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    "use strict";
    res.render('index', {
        user: req.user,
        title: 'Failure League'
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
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'failureleaguegame@gmail.com',
                pass: 'kyleorton'
            }
        });
    transporter.sendMail({
        from: 'failureleaguegame+' + req.body.messageType + '@gmail.com',
        to: 'failureleaguegame+' + req.body.messageType + '@gmail.com',
        subject: 'Site Form ' + req.body.messageType,
        text: 'user Email: ' + req.body.userEmail + 'user message: ' + req.body.message
    });
    res.status(200).end();
});

module.exports = router;
