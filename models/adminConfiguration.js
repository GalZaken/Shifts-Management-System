var mongoose = require('mongoose');

var AdminConfigurationSchema = new mongoose.Schema({

    morningPriority: Number,
    eveningPriority: Number,
    nightPriority: Number
});

var AdminConfiguration = module.exports = mongoose.model('configuration', AdminConfigurationSchema);

module.exports.createAdminConfiguration = function (comment, callback) {
    comment.save(callback);
};

module.exports.updateAdminConfigurationByID = function(id, configuration, callback) {
    AdminConfiguration.findByIdAndUpdate(id, configuration, callback);
};

module.exports.getAdminConfiguration = function(callback) {
    var query = {};
    AdminConfiguration.findOne(query, callback);
};
