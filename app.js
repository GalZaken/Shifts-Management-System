// ------- REQUIRED MODULES: ------- //

var express = require('express');
var path    = require('path');

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var routes = require('./routes/routes');
var users = require('./routes/users');

var databaseConfiguration = require('./config/databaseConfiguration.js');
mongoose.connect(databaseConfiguration.dbURL, function (error) {
    console.log("\nTrying to connect to " + databaseConfiguration.dbName + "...");
    if(error){
        console.log("Error: Connection failed!\n");
    } else {
        console.log("CONNECTION SUCCEEDED!");
        console.log("App is now connected to " + databaseConfiguration.dbName + "\n");
    }
});

// -------------------------------------------------------------------------------------


// ------- SETUP EXPRESS APPLICATION: ------- //

var app = express();

// SET VIEW ENGINE:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// SET STATIC FOLDER:
app.use(express.static(path.join(__dirname, 'public')));

// CONSOLE LOG - REQUESTS:
app.use(logger('dev'));

// BODY & COOKIE PARSER:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// EXPRESS SESSION:
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

// INIT PASSPORT:
app.use(passport.initialize());
app.use(passport.session());

// CONNECT FLASH:
app.use(flash());

// ROUTES:
app.get('/partials/:name', routes.partials);
app.get('/', routes.ensureAuthenticated, routes.index);
app.use('/users', users);
app.get('*', routes.index);

// -------------------------------------------------------------------------------------

module.exports = app;
