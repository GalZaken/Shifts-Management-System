var express = require('express');
var router = express.Router();

/* GET /partials/name */
router.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
});

/* GET / -> Land Page */
router.get('/', ensureAuthenticated, function(req, res) {
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
