// Dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");

// Request and Cheerio makes the scraping possible
// Make HTTP request for HTML page
var request = require("request");

// Parse HTML and find elements
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapeData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error: ", error);
});

// // Main route (simple message)
// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
  "Grabbing every thread name and link\n" +
  "from The New York Times:" +
  "\n***********************************\n");

// Route 1: Retrieve the data from the scrapedData collection as a json
app.get("/all", function (req, res) {
  db.scrapedData.find().sort({}, function (error, data) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(data);
    }
  });
});


// Route 2: Scrape data from the site and save it to MongoDB. The page's HTML is passed as the callback's third argument
app.get("/index", function (req, res) {
  request("https://www.nytimes.com/", function (error, response, html) {

    // Load the HTML into Cheerio and save it to a variable
    var $ = cheerio.load(html);

    // Create an empty array to save the scraped data
    var results = [];

    // Use Cheerio to find each h2-tag with a "story-heading" class
    $("h2.story-heading").each(function (i, element) {

      // Save the text and href of each link enclosed in the current element
      var title = $(element).text();
      var link = $(element).children().attr("href");

      // Make sure 
      if (title && link) {
        db.scrapedData.insert(
          {
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(inserted);
          }
        });
      };
      res.send("Scrape Completed!");
    });
  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
