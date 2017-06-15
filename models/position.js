var mongoose = require('mongoose');

var PositionSchema = new mongoose.Schema({

    positionName: String,
    shiftsArray: Array,
    inMorning: Boolean,
    inEvening: Boolean,
    inNight: Boolean
});

var Position = module.exports = mongoose.model('positions', PositionSchema);

// ------- POSITION METHODS: ------- //

module.exports.getPositionsList = function(callback) {
    var query = {};
    Position.find(query, callback);
}

module.exports.getPositionById = function(id, callback) {
    Position.findById(id, callback);
}

module.exports.createPosition = function (position, callback) {
    // Saving position in positions collection:
    position.save(callback);
}

module.exports.removePositionById = function(id, callback) {
    Position.findByIdAndRemove(id, callback);
}

module.exports.updatePositionById = function(id, updatePosition, callback) {
    Position.findByIdAndUpdate(id, updatePosition, callback);
}