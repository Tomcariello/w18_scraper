# w18_scraper


12/04/2016
Created file structure & configured Cheerio to scrape Mother Jones

12/09/2016
Fixed package.json
enabled logic to ignore titles that are already in the database
adjusted routes/links so the user experience is single page


*****Instructions*****


# Week 18 Homework Assignment - All the News That's Fit to Scrape

### Overview

Create a web app that lets users leave comments on the latest news. 
But you're not going to actually write any articles; instead, scrape news from another site.

### Before You Begin
1. Create a GitHub repo for this assignment and clone it to your computer. 
   Any name will do -- just make sure it's related to this project in some fashion.

2. Run `npm init`. When that's finished, install and save these npm packages:
  * express
  * express-handlebars
  * mongoose
  * body-parser
  * cheerio
  * request
  * **NOTE**: If you want to earn complete credit for your work, you must use all 6 of these packages in your assignment.

3. In order to deploy your project to Heroku, you must set up an mLab provision. 
  mLab is remote MongoDB database that Heroku supports natively. Follow these steps to get it running:
  1. Create a Heroku app in your project directory. 
  2. Run this command in your Terminal/Bash window: 
    * `heroku addons:create mongolab`
    * This command will add the free mLab provision to your project.
  3. You'll need to find the URI string that connects Mongoose to mLab. Run this command to grab that string: 
    * `heroku config | grep MONGODB_URI`
    * Notice the value that appears after `MONGODB_URI => `. This is your URI string. Copy it to a document for safekeeping.
  4. When you’re ready to connect Mongoose with your remote database, simply paste the URI string as the lone argument of your `mongoose.connect()` function. That’s it!

4. [Watch this demo of a possible submission](../Week-18-Homework-Video.mov). 
  * Your site doesn't need to match the demo's style, but feel free to attempt something similar if you'd like. Otherwise, just be creative!


## Instructions
* Create an app that follows this user story:

  1. Scrape stories from a news outlet. The data should at least include a link to the story & a headline, 
      but feel free to add more content to your database. Use Cheerio to grab the content & Mongoose to save it 
      to your MongoDB database. 

  2. All users can leave comments on the stories you collect. They can also delete whatever comments they want removed. 
     Stored comments should be visible to all users. 
     Use Mongoose's model system to associate comments with particular articles. 

### Tips
* Make sure an article isn't already represented in your database before saving it; we don't want duplicates. 

* Don't just clear out your database & populate it with scraped articles whenever a user accesses your site. 
  * If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.

### Helpful Links

* [MongoDB Documentation](https://docs.mongodb.com/manual/)
* [Mongoose Documentation](http://mongoosejs.com/docs/api.html)
* [Cheerio Documentation](https://github.com/cheeriojs/cheerio)