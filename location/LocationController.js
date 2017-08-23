var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
var Location = require('./Location');

// CREATES A NEW LOCATION
router.post('/', function (req, res) {
    Location.create({
            LICENSE_NUMBER: req.body.LICENSE_NUMBER,
            Licensee_Name: req.body.Licensee_Name,
            Business_Name: req.body.Business_Name,
            License_Type: req.body.License_Type,
            ACTIVE: req.body.ACTIVE,
            COUNTY: req.body.COUNTY,
            Retail_Delivery: req.body.Retail_Delivery,
            Location_Full_Address: req.body.Location_Full_Address,
            Latitude: req.body.Latitude,
            Longitude: req.body.Longitude,
            Partnership_Level_Score: req.body.Partnership_Level_Score,
            Phone_Number: req.body.Phone_Number,
            Email: req.body.Email,
            Territory: req.body.Territory,
            Decision_Maker: req.body.Decision_Maker,
            BudTender: req.body.BudTender,
            Retail_Price_Point: req.body.Retail_Price_Point,
            Sell_Edibles: req.body.Sell_Edibles,
            On_Leafly: req.body.On_Leafly,
            Description: req.body.Description         
        },
        function (err, location) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(location);
        });
});

// RETURNS ALL THE LOCATIONS IN THE DATABASE
router.get('/', function (req, res) {
    Location.find({}, function (err, locations) {
        if (err) return res.status(500).send("There was a problem finding the locations.");
        res.status(200).send(locations);
    });
});

// GETS A SINGLE LOCATION FROM THE DATABASE
router.get('/:id', function (req, res) {
    Location.findById(req.params.id, function (err, location) {
        if (err) return res.status(500).send("There was a problem finding the location.");
        if (!location) return res.status(404).send("No location found.");
        res.status(200).send(location);
    });
});

// DELETES A LOCATION FROM THE DATABASE
router.delete('/:id', function (req, res) {
    Location.findByIdAndRemove(req.params.id, function (err, location) {
        if (err) return res.status(500).send("There was a problem deleting the location.");
        res.status(200).send("Location: "+ location.name +" was deleted.");
    });
});

// UPDATES A SINGLE LOCATION IN THE DATABASE
router.put('/:id', function (req, res) {
    Location.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, location) {
        if (err) return res.status(500).send("There was a problem updating the location.");
        res.status(200).send(location);
    });
});


module.exports = router;
