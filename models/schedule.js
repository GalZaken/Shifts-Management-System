var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({

    published: Boolean,

    startDateString: String,
    startDate: Date,

    endDateString: String,
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

module.exports.getScheduleCollection = function(callback) {
    var query = {};
    Schedule.find(query, callback);
}

module.exports.getScheduleById = function(id, callback) {
    Schedule.findById(id, callback);
}

module.exports.getScheduleByStringDates = function(startDateString, endDateString, callback) {
    var query = { startDateString: startDateString, endDateString: endDateString };
    Schedule.findOne(query, callback);
}

module.exports.createSchedule = function (schedule, callback) {
    // Saving schedule in schedules collection:
    schedule.save(callback);
}

module.exports.updateScheduleById = function(id, updateSchedule, callback) {
    Schedule.findByIdAndUpdate(id, updateSchedule, callback);
}