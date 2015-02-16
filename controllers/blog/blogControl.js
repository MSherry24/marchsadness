/**
 * Created by MSherry on 2/10/2015.
 */
var User = require('../../models/usermodel');
var Blog = require('../../models/blogModel');

var getTimeStamp = function () {
    "use strict";
    var date = new Date(),
        ampm = 'am',
        month = date.getMonth() + 1,
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours() - 6,
        minute = date.getMinutes();
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (hour >= 12) {
        ampm = 'pm';
    }
    if (hour === 0) { hour = 12; }
    if (hour > 12) {
        hour = hour - 12;
    }
    return month + '/' + day + '/' + year + ' (' + hour + ':' + minute + ampm + ' CST) ';
};

exports.deletePost = function (req, res) {
    "use strict";
    Blog.BlogPost.findOne({"_id" : req.body.postId}, function (err, post) {
        if (err) {
            console.log(err);
        }
        if (post) {
            post.remove(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                res.status(200).end();
            });
        }
    });
};

exports.editPost = function (req, res) {
    "use strict";
    Blog.BlogPost.update({"_id": req.body.postId}, {
        title: req.body.postTitle,
        body: req.body.postBody
    }, function (err) {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
        res.status(200).end();
    });
};

exports.postNewBlog = function (req, res) {
    "use strict";
    var newBlog = new Blog.BlogPost({
        author: req.user.firstName,
        title: req.body.postTitle,
        body: req.body.postBody,
        timestamp: getTimeStamp()
    });
    newBlog.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.status(200).end();
    });
};