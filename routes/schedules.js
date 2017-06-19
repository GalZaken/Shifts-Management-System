var express = require('express');
var router = express.Router();

var Schedule = require('../models/schedule');

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

// Get Schedule By ID From DB:
router.get('/:id', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/:id');

    var id = req.params.id;
    Schedule.getScheduleById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Get schedule from schedules collection!');
        else
            res.status(200).json(docs);
    });
});

// Get Schedule By Dates From DB:
router.get('/dates/:currentFirstDay/:currentLastDay', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/:currentFirstDay:currentLastDay');

    var currentFirstDay = req.params.currentFirstDay;
    var currentLastDay = req.params.currentLastDay;

    var currentDate = new Date(); // Get current date
    var currentStartDate = new Date(currentDate.setDate(currentFirstDay)); // Date variable
    var currentEndDate = new Date(currentDate.setDate(currentLastDay)); // Date variable

    Schedule.getScheduleByDates(currentStartDate, currentEndDate, function(err, docs) {
        if (err)
            console.log('ERROR: Get schedule from schedules collection!');
        else if (!docs) {
            console.log("Current Date Schedule is not exist in DB -> Should be created!");
            var newSchedule = new Schedule({
                published: false,
                startDate: currentStartDate,
                endDate: currentEndDate,
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
            Schedule.createSchedule(newSchedule, function (err, docs) {
                if (err)
                    console.log('ERROR: Create schedule in schedules collection!');
                else {
                    console.log('New schedule has been created');
                    res.status(200).json(docs);
                }
            });
        }
        else {
            console.log("Schedule in DB -> response!");
            console.log("DOCS: " + docs);
            res.status(200).json(docs);
        }
    });
});

// Adding schedule to DB (schedules collection):
router.post('/', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling POST /schedules/');

    var newSchedule = new Schedule(req.body);
    Schedule.createSchedule(newPosition, function(err, docs) {
        if (err)
            console.log('ERROR: Save schedule in schedules collection!');
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

module.exports = router;