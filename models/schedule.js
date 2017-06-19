var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({

    published: Boolean,
    startDate: Date,
    endDate: Date,
    morningShift: {
        positionsArray: Array
    },
    eveningShift: {
        positionsArray: Array
    },
    nightShift: {
        positionsArray: Array
    }
});

var Schedule = module.exports = mongoose.model('schedules', ScheduleSchema);

// ------- SCHEDULE METHODS: ------- //

module.exports.getScheduleList = function(callback) {
    var query = {};
    Schedule.find(query, callback);
}

module.exports.getScheduleById = function(id, callback) {
    Schedule.findById(id, callback);
}

module.exports.getScheduleByDates = function(startDate, endDate, callback) {
    var query = { startDate: startDate, endDate: endDate };
    Schedule.findOne(query, callback);
}

module.exports.createSchedule = function (schedule, callback) {
    // Saving schedule in schedules collection:
    schedule.save(callback);
}

module.exports.updateScheduleById = function(id, updateSchedule, callback) {
    Schedule.findByIdAndUpdate(id, updateSchedule, callback);
}