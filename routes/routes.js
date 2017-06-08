exports.index = function(req, res) {

    if (req.user) {
        res.render('index', { username: req.user.username });

    }
}

exports.ensureAuthenticated = function(req, res, next) {
    // IF USER IS AUTHENTICATED IN THE SESSION:
    if (req.isAuthenticated()) {
        console.log("\nAUTHENTICATION SUCCEEDED!");
        return next();
    }
    else // REDIRECT TO LOGIN PAGE:
        res.redirect('/users/login');
}

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

