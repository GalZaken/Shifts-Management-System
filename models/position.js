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

module.exports.createPosition = function (position, callback) {
    // Saving position in positions collection:
    position.save(callback);
};