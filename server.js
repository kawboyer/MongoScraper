// Dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");

// Request and cheerio make the scraping possible.
var request = require("request");
var cheerio = require("cheerio");

// Axios is a promised-based http library that works on the client end on the server.
var axios = require("axios");

// Require all models
var db = require("./models");

// Heroku port through process.env.PORT or localhost:3000
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());

// Use express.static to serve the public folder as a static directory
app.use(express.static("views"));

// Connect to the Mongo DB or localhost 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_j33rr0db:bdruofjsh6fr9qtdce6umsee4v@ds147589.mlab.com:47589/heroku_j33rr0db"
console.log("This is the MONGODB_URI: " + MONGODB_URI);

// Database Configuration with Mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var scraper = require("./controller/scraper.js")

// Start the server
app.listen(PORT, function () {
  console.log("App listening on port " + PORT + "!");
});

// // Set handlebars
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");