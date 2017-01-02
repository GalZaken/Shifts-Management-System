// ------- REQUIRED MODULES: ------- //

var express = require('express');
var path    = require('path');

var mongoose = require('mongoose');

var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var databaseConfiguration = require('./config/databaseConfiguration.js');
mongoose.connect(databaseConfiguration.dbURL, function(error) {
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

// ROUTES:
app.use('/', index);
app.use('/users', users);

// -------------------------------------------------------------------------------------

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
