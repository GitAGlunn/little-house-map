var mongoose = require('mongoose');
var LocationSchema = new mongoose.Schema({
  LICENSE_NUMBER: String,
  Licensee_Name: String,
  Business_Name: String,
  License_Type: String,
  ACTIVE: String,
  COUNTY: String,
  Retail_Delivery: String,
  Location_Full_Address: String,
  Latitude: String,
  Longitude: String,
  Partnership_Level_Score: String,
  Phone_Number: String,
  Email: String,
  Territory: String,
  Decision_Maker: String,
  BudTender: String,
  Retail_Price_Point: String,
  Sell_Edibles: String,
  On_Leafly: String,
  Description: String
});
mongoose.model('Location', LocationSchema);

module.exports = mongoose.model('Location');
