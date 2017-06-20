var express = require('express');
var router = express.Router();

var Schedule = require('../models/schedule');
// var node_schedule = require('node-schedule');

// node_schedule.scheduleJob('10 * * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });

// Get Schedule From DB:
router.get('/schedulesList', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/schedulesList');

    Schedule.getScheduleList(function(err, docs) {
        if (err)
            console.log('ERROR: Get Schedules List from schedules collection!');
        else
            res.status(200).json(docs);
    });
});

// Get Schedule By Dates From DB:
router.get('/:startDateString/:endDateString', initSchedulesModel, function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/:startDateString/:endDateString');

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

    Schedule.updatePositionById(id, updateSchedule, function(err, docs) {
        if (err)
            console.log('ERROR: Update schedule in schedules collection!');
        else
            res.status(200).json(docs);
    });
});

// Middleware Functions:
function initSchedulesModel(req, res, next) {
    console.log('INSIDE SCHEDULES ROUTER - Handling Middleware Function: initSchedulesModel');

    var startDateString = req.params.startDateString;
    var endDateString = req.params.endDateString;

    Schedule.getScheduleCollection(function(err, docs) {
        if (err)
            console.log('ERROR: Get schedule from schedules collection!');
        else if (docs.length == 0) {

            console.log("Schedules collection is empty!");
            console.log("Creating default schedule...");

            var defaultSchedule = new Schedule({
                published: true, // Published true because this schedule will not be filled.

                startDateString: startDateString,
                startDate: new Date(startDateString),

                endDateString: endDateString,
                endDate: new Date(endDateString),

                morningShift: {
                    positionsArray: []
                },
                eveningShift: {
                    positionsArray: []
                },
                nightShift: {
                    positionsArray: []
                }
            });

            Schedule.createSchedule(defaultSchedule, function (err, docs) {
                if (err)
                    console.log('ERROR: Saving default schedule in schedules collection!');
                else if (!docs)
                    console.log('Failed to create default schedule!');
                else {
                    console.log('Default schedule has been created!');
                    next();
                }

            });
        }
        else {
            console.log('Schedules model is already initialized!');
            next();
        }
    });
}

module.exports = router;