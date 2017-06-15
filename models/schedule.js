var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({

    positionName: String,
    morningShift: {},
    eveningShift: {},
    nightShift: {},
    startDate: Date,
    endDate: Date
});

var Schedule = module.exports = mongoose.model('schedules', ScheduleSchema);

// ------- SCHEDULE METHODS: ------- //

module.exports.getSchedule = function(callback) {
    var query = {};
    Schedule.find(query, callback);
}

module.exports.getScheduleById = function(id, callback) {
    Schedule.findById(id, callback);
}

module.exports.createSchedule = function (schedule, callback) {
    // Saving position in positions collection:
    schedule.save(callback);
}

module.exports.updateScheduleById = function(id, updateSchedule, callback) {
    Schedule.findByIdAndUpdate(id, updateSchedule, callback);
}