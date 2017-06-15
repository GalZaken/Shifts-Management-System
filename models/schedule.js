var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({

    positionName: String,
    morningShift: {
        positionsArray: Array,
        priority: String
    },
    eveningShift: {
        positionsArray: Array,
        priority: String
    },
    nightShift: {
        positionsArray: Array,
        priority: String
    },
    startDate: Date,
    endDate: Date
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

module.exports.createSchedule = function (schedule, callback) {

    // Get startDate and endDate for the new schedule:
    var currentDate = new Date; // Get current date
    var firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
    var lastDayOfWeek = firstDayOfWeek + 6; // Last day is the first day + 6

    var startDate = new Date(currentDate.setDate(firstDayOfWeek)).toUTCString();
    var endDate = new Date(currentDate.setDate(lastDayOfWeek)).toUTCString();

    schedule.startDate = startDate;
    schedule.endDate = endDate;

    // Saving schedule in schedules collection:
    schedule.save(callback);
}

module.exports.updateScheduleById = function(id, updateSchedule, callback) {
    Schedule.findByIdAndUpdate(id, updateSchedule, callback);
}