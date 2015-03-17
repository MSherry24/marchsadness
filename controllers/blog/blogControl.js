/**
 * Created by MSherry on 2/10/2015.
 */
var User = require('../../models/usermodel');
var Blog = require('../../models/blogModel');

var getTimeStamp = function () {
    "use strict";
    var date = new Date(),
        ampm = 'am',
        month,
        day,
        year,
        hour,
        minute;
    date.setHours(date.getHours() - 6);
    month = date.getMonth() + 1;
    month = month.length === 1 ? "0" + month : month;
    day = date.getDate();
    day = day.length === 1 ? "0" + day : day;
    year = date.getFullYear();
    hour = date.getHours();
    hour = hour.length === 1 ? "0" + hour : hour;
    minute = date.getMinutes();
    minute = minute.length === 1 ? "0" + minute : minute;
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
        body: req.body.postBody,
        preview: req.body.postPreview
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
        preview: req.body.postPreview,
        timestamp: getTimeStamp()
    });
    newBlog.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.status(200).end();
    });
};