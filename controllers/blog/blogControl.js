/**
 * Created by MSherry on 2/10/2015.
 */
var User = require('../../models/usermodel');
var Blog = require('../../models/blogModel');

exports.newBlogPost = function(req, res) {
    User.findById(req.user._id, function (err, user) {
        var newPost;

        newPost = new Blog.BlogPost ({
            title: req.body.title,
            body: req.body.body,
            author: user.firstName,
            timeStamp: this.getTimeStamp()
        });
        newPost.save(function(err) {
            if (err) {
                console.log('blog save error:' + err);
            }
            res.status(500).end();
        })
    })
};

var getTimeStamp = function () {
    var
        date = new Date(),
        ampm = 'am',
        month = date.getMonth() + 1,
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes();
    date.setHours(date.getHours() - 5);
    if (hour === 0) { hour = 12; }
    if (hour > 12) {
        hour = hour - 12;
        ampm = 'pm';
    }
    return month + '/' + day + '/' + year + ' (' + hour + ':' + minute + ampm + '): ';
}