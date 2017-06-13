var express = require('express');
var router = express.Router();

var AdminComment = require('../models/adminComment');

router.get('/adminComment', function(req, res) {
    console.log('INSIDE COMMENT ROUTER - Handling GET /adminComment');

    AdminComment.getAdminComment(function(err, docs) {
        if (err){
            console.log('ERROR: Get admin comment in adminComment collection!');

            //CREATE NEW SCHEMA
            AdminComment.createAdminComment({ comment: "" }, function (err, docs) {
                if (err)
                    console.log('ERROR: Save comment in adminComment collection!');
                else
                    res.status(200).json(docs);
            });
        }
        else
            res.status(200).json(docs);
    });
});

router.put('/adminComment/:id', function(req, res) {
    console.log('INSIDE COMMENT ROUTER - Handling PUT /comment/adminComment/:id');
    var id = req.params.id;
    var updateComment = new AdminComment(req.body);

    AdminComment.updateUserById(id, updateComment, function(err, docs) {
        if (err)
            console.log('ERROR: Update admin comment in adminComment collection!');
        else
            res.status(200).json(docs);
    });
});

module.exports = router;