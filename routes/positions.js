var express = require('express');
var router = express.Router();

var Position = require('../models/position');

// Get Positions List From DB:
router.get('/positionsList', function(req, res) {
    console.log('INSIDE POSITIONS ROUTER - Handling GET /positions/positionsList');

    Position.getPositionsList(function(err, docs) {
        if (err)
            console.log('ERROR: Get Positions List from positions collection!');
        else
            res.status(200).json(docs);
    });
});

// Get Position By ID From DB:
router.get('/:id', function(req, res) {
    console.log('INSIDE POSITIONS ROUTER - Handling GET /:id');

    var id = req.params.id;
    Position.getPositionById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Get position from positions collection!');
        else
            res.status(200).json(docs);
    });
});

// Adding Position to DB (positions collection):
router.post('/', function(req, res) {
    console.log('INSIDE POSITIONS ROUTER - Handling POST /positions/');

    var newPosition = new Position(req.body);
    Position.createPosition(newPosition, function(err, docs) {
        if (err)
            console.log('ERROR: Save position in positions collection!');
        else
            res.status(200).json(docs);
    });
});

router.delete('/:id', function (req, res) {
    console.log('INSIDE POSITIONS ROUTER - Handling DELETE /positions/:id');
    var id = req.params.id;
    Position.removePositionById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Remove position from positions collection!');
        else
            res.status(200).json(docs);
    });
});

router.put('/:id', function(req, res) {
    console.log('INSIDE POSITIONS ROUTER - Handling PUT /positions/:id');
    var id = req.params.id;
    var updatePosition = new Position(req.body);

    Position.updatePositionById(id, updatePosition, function(err, docs) {
        if (err)
            console.log('ERROR: Update position in positions collection!');
        else
            res.status(200).json(docs);
    });
});

module.exports = router;