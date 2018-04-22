// Dependencies
var express = require("express");
var router = express.Router();
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");

// Npm packages request and cheerio make the scraping possible.
// Make HTTP request for HTML page
var request = require("request");
// Parse HTML and find elements
var cheerio = require("cheerio");

// Axios is a promised-based http library, similar to jQuery's Ajax method. It works on the client and on the server.
var axios = require("axios");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

var PORT = 3000;

// // Set handlebars
// var exphbs = require("express-handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB or localhost 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_j33rr0db:bdruofjsh6fr9qtdce6umsee4v@ds147589.mlab.com:47589/heroku_j33rr0db"
console.log("This is the MONGODB_URI: " + MONGODB_URI);

// Database Configuration with Mongoose
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// A GET route for scraping the New York Times website.
app.get("/scrape", function (req, res) {
  console.log("Hi this is a scrape");
  // 1. Grab the body of the html with request.
  axios.get("https://www.nytimes.com/").then(function (response) {
    // Load that into cheerio and save it to $ for a shorthand selector.
    var $ = cheerio.load(response.data);

    // 2. Grab every h2 within an article tag.
    $("h2.story-heading").each(function (i, element) {
      // Save an empty result object.
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object.
      result.link = $(this)
        .children("a")
        .attr("href");

      console.log(result)

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      console.log(result)
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

app.get('/articles', function (request, response) {

  // get all the articles
  db.Article.find({})

    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      response.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      response.json(err);
    });

  });


// 

// Route for grabbing a specific Article by id, populate it with it's Comment
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the Comments associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  // Create a new Comment and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's Comment
app.get("/articles/comments", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Comment.findOne({ _id: req.params.id })
    // ..and populate all of the Comments associated with it
    .populate("comment")
    .then(function(dbComment) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbComment);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App listening on port " + PORT + "!");
});