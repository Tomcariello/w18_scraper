/* Showing Mongoose's "Populated" Method (18.3.8) */

// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
mongoose.connect('mongodb://localhost/week18_hw');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

//Note is the schema used to save the comments left by the users
var Note = require('./models/Note.js');
//Article is the schema used to save the Article info found by the scraper
var Article = require('./models/Article.js');

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the motherjones website.
app.get('/scrape', function(req, res) {
  request('http://www.motherjones.com//', function(error, response, html) {

  	// then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    //Create a variable to hold the titles that are already in the database
    var allTitles = [];

    //pull current database of titles and push them into the array
    Article.find({}, function(err, doc) {
      for (i=0; i < doc.length; i++) {
        allTitles.push(doc[i].title);
      }

      //Pull every span < h3 from the scraped data
      $('span h3').each(function(i, element) {
        //Create an empty object to use to pass the scraped data into the database
				var result = {};
        //Set boolean variable to track if a title is already in the database
        var alreadyInDatabase = false;

        //Pull the title out of the current instance
        result.title = $(this).children('a').text();

        //check if this title is already in the database
        for (j=0; j < allTitles.length; j++) {
          if (result.title == allTitles[j]){
            // console.log(result.title + " | " + allTitles[j]);
            // console.log('already in the db. Punch out');
            alreadyInDatabase = true;
            }
        }

        //Do this is the article title is not already in the database
        if (alreadyInDatabase == false) {

  				// set the url to the object previously created
  				result.link = "http://www.motherjones.com/" + $(this).children('a').attr('href');

  				//save scraped data object into variable
  				var entry = new Article (result);

  				//save data to the db
  				entry.save(function(err, doc) {
  				  if (err) {
  				    console.log(err);
  				  } 
  				  else {
  				  }
  				});
        }
      });
    })
    res.redirect("/");
  });
});

// this will get the articles we scraped from mongoDB
app.get('/articles', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

//grab an article by it's ObjectId
app.get('/articles/:id', function(req, res){
  //find article by it's ID
	Article.findOne({'_id': req.params.id})
	// and populate all of the notes associated with it.
	.populate('Notes')
	// now, execute our query
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		}	else {
			res.json(doc);
		}
	});
});

// grab all of the notes associated with an article
app.get('/notes/:id', function(req, res){
  Article.findOne({'_id': req.params.id})
  .populate('Note')
  .exec(function(err, doc){
    // log any errors
    if (err){
      console.log(err);
    } else {
      console.log(doc);
      res.json(doc);
    }
  });
});

// make the posted note a new note.
app.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		}	else {
			// using the Article id find the matching Article in our db & add it
      Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'Notes': doc._id}}, {new: true})

			// execute the above query
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
