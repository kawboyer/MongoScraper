// Dependencies
var express = require("express");
var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");

var router = express.Router();
var path = require("path");

// HTML Route loads index.html
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "/views/index.html"));
});

// A GET route for scraping the New York Times website.
router.get("/scrape", function (req, res) {
  console.log("Hi this is a scrape");
  // Grab the body of the html with request.
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
        //console.log(result)

      // Create a new Article using the "result" object built from scraping
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

    // If the scrape was successful, save an Article and send a message to the client.
    res.send("Scrape was completed!");
  });
});

router.get('/articles', function (request, response) {

  // Get all articles
  db.Article.find({})

    .then(function(dbArticle) {
      // If finding the articles was successful, send them back to the client
      response.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, let the client know
      response.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's Comment
router.get("/articles/:id", function(req, res) {
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
router.post("/articles/:id", function(req, res) {
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
router.get("/articles/comments", function(req, res) {
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

module.exports = router;