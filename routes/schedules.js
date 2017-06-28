var express = require('express');
var router = express.Router();

var Schedule = require('../models/schedule');
var Position = require('../models/position');

// Get Schedule From DB:
router.get('/schedulesList', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/schedulesList');

    Schedule.getScheduleCollection(function(err, docs) {
        if (err)
            console.log('ERROR: Get Schedules collection!');
        else
            res.status(200).json(docs);
    });
});

// Get Current Schedule And Init:
router.get('/currentSchedule/:startDateString/:endDateString', initCurrentSchedule, initNextWeekSchedule, function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/currentSchedule/:startDateString/:endDateString');

    var startDateString = req.params.startDateString;
    var endDateString = req.params.endDateString;

    Schedule.getScheduleByStringDates(startDateString, endDateString, function(err, docs) {
        if (err)
            console.log('ERROR: Get schedule from schedules collection!');

        else if (!docs) {

            console.log("Requested Schedule doesn't exist in DB!");
            res.status(200).json();
        }
        else {
            console.log("Get schedule by string dates succeeded!");
            res.status(200).json(docs);
        }
    });
});

// Get Schedule By Dates From DB:
router.get('/schedule/:startDateString/:endDateString', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/schedule/:startDateString/:endDateString');

    var startDateString = req.params.startDateString;
    var endDateString = req.params.endDateString;

    Schedule.getScheduleByStringDates(startDateString, endDateString, function(err, docs) {
        if (err)
            console.log('ERROR: Get schedule from schedules collection!');

        else if (!docs) {

            console.log("Requested Schedule doesn't exist in DB!");
            res.status(200).json();
        }
        else
            res.status(200).json(docs);
    });
});

// Adding schedule to DB (schedules collection):
router.post('/', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling POST /schedules/');

    var newSchedule = new Schedule(req.body);
    Schedule.createSchedule(newSchedule, function(err, docs) {
        if (err)
            console.log('ERROR: Saving schedule in schedules collection!');
        else
            res.status(200).json(docs);
    });
});

router.put('/:id', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling PUT /schedules/:id');
    var id = req.params.id;
    var updateSchedule = new Schedule(req.body);

    Schedule.updateScheduleById(id, updateSchedule, function(err, docs) {
        if (err)
            console.log('ERROR: Update schedule in schedules collection!');
        else
            res.status(200).json(docs);
    });
});

// Middleware Functions:
function initCurrentSchedule(req, res, next) {
    console.log('INSIDE SCHEDULES ROUTER - Handling Middleware Function: initCurrentSchedule.');

    var startDateString = req.params.startDateString;
    var endDateString = req.params.endDateString;

    Schedule.getScheduleByStringDates(startDateString, endDateString, function(err, docs) {

        if (err) {
            console.log('ERROR: Get schedule from schedules collection!');
            return;
        }

        else if (!docs) {
            console.log("Current dates schedule doesn't exist in schedules collection!");
            console.log("Creating current schedule...");

            var currentSchedule = new Schedule({
                published: false,

                startDateString: startDateString,
                startDate: new Date(startDateString),

                endDateString: endDateString,
                endDate: new Date(endDateString),

                morningShift: {
                    positionsArray: new Array()
                },
                eveningShift: {
                    positionsArray: new Array()
                },
                nightShift: {
                    positionsArray: new Array()
                }
            });

            Schedule.createSchedule(currentSchedule, function (err, docs) {
                if (err)
                    console.log('ERROR: Saving current schedule in schedules collection!');
                else if (!docs)
                    console.log('Failed to create current schedule!');
                else
                    console.log('Current schedule has been created!');
            });

            next();
        }

        else {
            console.log('Current schedule is already exist!');
            next();
        }
    });
}

function initNextWeekSchedule(req, res, next) {

    console.log('INSIDE SCHEDULES ROUTER - Handling Middleware Function: initNextWeekSchedule.');
    console.log('Checking if next week schedule exist...');

    var startDateString = req.params.startDateString;
    var endDateString = req.params.endDateString;

    var currentScheduleStartDate = new Date(startDateString); // Current start date.
    var currentScheduleEndDate = new Date(endDateString); // Current end date.

    var nextWeekFirstDay = currentScheduleStartDate.getDate() + 7; // First day of next week.
    var nextWeekLastDay = currentScheduleEndDate.getDate() + 7; // Last day of next week.

    var nextWeekStartDate = new Date(currentScheduleStartDate.setDate(nextWeekFirstDay));
    var nextWeekEndDate = new Date(currentScheduleEndDate.setDate(nextWeekLastDay));

    // console.log("nextWeekStartDate: " + nextWeekStartDate);
    // console.log("nextWeekEndDate: " + nextWeekEndDate);

    var nextWeekStartDateString = nextWeekStartDate.toISOString().substring(0, 10);
    var nextWeekEndDateString = nextWeekEndDate.toISOString().substring(0, 10);

    // console.log("nextWeekStartDateString: " + nextWeekStartDateString);
    // console.log("nextWeekEndDateString: " + nextWeekEndDateString);

    Schedule.getScheduleByStringDates(nextWeekStartDateString, nextWeekEndDateString, function(err, docs) {

        if (err) {
            console.log('ERROR: Get next week schedule from schedules collection!');
            return;
        }

        else if (!docs) {
            console.log("Next week dates schedule doesn't exist in schedules collection!");
            console.log("Creating next week schedule...");

            var nextWeekSchedule = new Schedule({
                published: false,

                startDateString: nextWeekStartDateString,
                startDate: new Date(nextWeekStartDateString),

                endDateString: nextWeekEndDateString,
                endDate: new Date(nextWeekEndDateString),

                morningShift: {
                    positionsArray: new Array()
                },
                eveningShift: {
                    positionsArray: new Array()
                },
                nightShift: {
                    positionsArray: new Array()
                }
            });

            Schedule.createSchedule(nextWeekSchedule, function (err, docs) {
                if (err)
                    console.log('ERROR: Saving next week schedule in schedules collection!');
                else if (!docs)
                    console.log('Failed to create next week schedule!');
                else
                    console.log('Next week schedule has been created!');
            });

            next();
        }

        else {
            console.log('Next week schedule is already exist!');
            next();
        }
    });
}

module.exports = router;