var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({

    comment: String
});

var AdminComment = module.exports = mongoose.model('adminComment', CommentSchema);


/*** Comment Functions ***/

module.exports.createAdminComment = function (comment, callback) {

    comment.save(callback);
};

module.exports.updateAdminCommentByID = function(id, comment, callback) {
    AdminComment.findByIdAndUpdate(id, comment, callback);
};

module.exports.getAdminComment = function(callback) {
    var query = {};
    AdminComment.findOne(query, callback);
};
