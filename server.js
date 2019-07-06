const express = require('express');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

const app = express();

app.get('/scrape', function(req, res) {
    const url = 'http://www.imdb.com/title/tt1229340/';

    // the structure of our request call
    // the first parameter is our url
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request
        if(!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            const $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            let title, release, rating;
            let json = {title: "", release: "", rating: ""};

            // get title 
            $('.title_wrapper').filter(function() {
                // Let's store the data we filter into a variable so we can easily see what's going on.
                let data = $(this);
                
                title = data.children().first().text().trim();
                json.title = title;

            });

            // get release year
            $('#titleYear').filter(function(){
                let data = $(this);

                release = data.children().text();
                json.release = release;
            });

            // get rating
            $('.ratingValue').filter(function(){
                let data = $(this);

                rating = data.children().children().text();

                json.rating = rating;
            });

            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function
            
            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
                console.log('File successfully written! - Check your project directory for the output.json file');
            });

            // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');

        } else {
            console.log(error);
        }

    });
    

});

app.listen('8000');

console.log('Magic happens on port 8000');

exports = module.exports = app;