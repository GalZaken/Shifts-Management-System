var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('index', { username: req.user.username });
});

function ensureAuthenticated(req, res, next) {
    // IF USER IS AUTHENTICATED IN THE SESSION:
    if (req.isAuthenticated()) {
        console.log("\nAUTHENTICATION SUCCEEDED!");
        return next();
    }
    else // REDIRECT TO LOGIN PAGE:
        res.redirect('/users/login');
}

module.exports = router;
