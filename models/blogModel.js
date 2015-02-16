var mongoose = require('mongoose');
var db = mongoose.connection;
var blogModel = {};

var blogPostSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    timestamp: String
});

var BlogPost = mongoose.model('Blog_Post', blogPostSchema);
blogModel.BlogPost = BlogPost;

blogModel.getTimeStamp = function() {
    "use strict";
    var date = new Date(),
        ampm = 'am',
        month = date.getMonth() + 1,
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes();
    date.setHours(date.getHours() - 5);
    if (hour >= 12) {
        ampm = 'pm';
    }
    if (hour === 0) { hour = 12; }
    if (hour > 12) {
        hour = hour - 12;
    }
    return month + '/' + day + '/' + year + ' (' + hour + ':' + minute + ampm + ' CST) ';
};

module.exports = blogModel;

