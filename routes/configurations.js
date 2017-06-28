var express = require('express');
var router = express.Router();

var AdminConfiguration = require('../models/adminConfiguration');

router.get('/', function(req, res) {
    console.log('INSIDE CONFIGURATION ROUTER - Handling GET /');

    AdminConfiguration.getAdminConfiguration(function(err, docs) {
        if (err)
            console.log('ERROR: Get admin configuration in configuration collection!');

        else if (!docs) {
            var adminConfiguration = new AdminConfiguration(
                {
                    morningPriority: 3,
                    eveningPriority: 2,
                    nightPriority: 1
                }
            );

            AdminConfiguration.createAdminConfiguration(adminConfiguration, function (err, docs) {
                if (err)
                    console.log('ERROR: Create configuration in configuration collection!');
                else {
                    console.log('Admin configuration has been created!');
                    res.status(200).json(docs);
                }
            });
        }
        else
            res.status(200).json(docs);
    });
});

router.put('/:id', function(req, res) {
    console.log('INSIDE CONFIGURATION ROUTER - Handling PUT /configuration/:id');


    var id = req.params.id;
    var updateConfiguration = new AdminConfiguration(req.body);
    updateConfiguration._id = id;

    AdminConfiguration.updateAdminConfigurationByID(id, updateConfiguration, function(err, docs) {
        if (err)
            console.log('ERROR: Update admin configuration in configuration collection!');
        else
            res.status(200).json(docs);
    });
});

module.exports = router;