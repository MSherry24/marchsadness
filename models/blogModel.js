var mongoose = require('mongoose');
var db = mongoose.connection;
var blogModel = {};

var blogPostSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    preview: String,
    timestamp: String
});

var BlogPost = mongoose.model('Blog_Post', blogPostSchema);
blogModel.BlogPost = BlogPost;

module.exports = blogModel;

