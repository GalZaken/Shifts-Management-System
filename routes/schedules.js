var express = require('express');
var router = express.Router();

var Schedule = require('../models/schedule');

// Get Schedule From DB:
router.get('/', function(req, res) {
    console.log('INSIDE SCHEDULES ROUTER - Handling GET /schedules/');

    Schedule.getSchedule(function(err, docs) {
        if (err)
            console.log('ERROR: Get Schedule List from schedules collection!');
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