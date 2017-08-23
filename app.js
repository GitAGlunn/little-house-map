var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var LocationController = require('./location/LocationController');
app.use('/locations', LocationController);

// Add static middleware
app.use(express.static(__dirname + '/public'));

// Create our Express router
var router = express.Router();

// // Initial dummy route for testing
// router.get('/', function(req, res) {
//   res.end('Twitatron');
// });

// Register all our routes
app.use(router);


module.exports = app;
