
// Dependencies
var express = require("express");
var router = express.Router();
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// var mongojs = require("mongojs");

// Request and Cheerio makes the scraping possible
// Make HTTP request for HTML page
var request = require("request");

// Parse HTML and find elements
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Require all models
var db = require("./models");

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));



// Connect to the Mongo DB

// Database Configuration with Mongoose
// ---------------------------------------------------------------------------------------------------------------
// Connect to localhost if not a production environment
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper"

// if(process.env.NODE_ENV == 'production'){
//   mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
// }
// else{
 mongoose.connect(MONGODB_URI);
 // YOU CAN IGNORE THE CONNECTION URL BELOW (LINE 41) THAT WAS JUST FOR DELETING STUFF ON A RE-DEPLOYMENT
 //mongoose.connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
// }


// // Route 1: Retrieve the data from the scrapedData collection as a json
// app.get("/all", function (req, res) {
//   db.scrapedData.find().sort({}, function (error, data) {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       res.json(data);
//     }
//   });
// });

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  console.log("Hi this is scrape");
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.story-heading").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      console.log(result)

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      console.log(result)
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

router.get('/', function(request, response) 
{

    // get all the articles
    Article.find({}, function(error, data) 
    {

        // check for error getting articles
        if (error) console.log("error getting articles", error);

        response.render('index', {title: "NewsScraper", articles: data});
    
    });

});


// scrape route
router.get('/scrape', function(request, response) 
{

    // run the scrapedWeb function from scraper
    scraper.scrapedWeb(function() 
    {

        // scrape then return to home page
        response.redirect('/');
    });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});


// Routes

// A GET route for scraping the echoJS website

// // Route 2: Scrape data from the site and save it to MongoDB. The page's HTML is passed as the callback's third argument
// app.get("/scraper", function (req, res) {
//   request("https://www.nytimes.com/", function (error, response, html) {

//     // Load the HTML into Cheerio and save it to a variable
//     var $ = cheerio.load(html);

//     // Create an empty array to save the scraped data
//     var results = [];

//     // Use Cheerio to find each h2-tag with a "story-heading" class
//     $("h2.story-heading").each(function (i, element) {

//       // Save the text and href of each link enclosed in the current element
//       var title = $(element).text();
//       var link = $(element).children().attr("href");

//       // Make sure 
//       if (title && link) {
//         db.scrapedData.insert(
//           {
//           title: title,
//           link: link
//         },
//         function(err, inserted) {
//           if (err) {
//             console.log(err);
//           }
//           else {
//             console.log(inserted);
//           }
//         });
//       };
//       res.send("Scrape Completed!");
//     });
//   });
// });