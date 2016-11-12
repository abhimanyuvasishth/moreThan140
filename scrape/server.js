/*
 * Credits to: https://github.com/scotch-io/node-web-scraper/blob/master/server.js
 */

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

url = 'http://www.un.org/news/';

// app.get('/scrape', function(req, res){

  request(url, function(error, response, html){
    if(!error){

      var $ = cheerio.load(html);
      var count = 1;
      var Data = function(){
        this.number;
        this.subject;
        this.headline;
        this.date;
      }

      var d = new Date();

      var day = d.getDate();
      var month = d.getMonth()+1;
      var year = d.getFullYear();
      var date = day+ '' + month+ '' +year;
      var nice_date = day+ '/' + month+ '/' +year;
      console.log("Today is: " + nice_date);

      var objects = [];
      var string;

      $('a').filter(function(){
        var data = $(this);
        if (data[0].attribs.href != null){
          if (data[0].attribs.href.indexOf("/apps/news/subject.asp?SubjectID=") > -1){
            var object = new Data();
            if ($(data[0]).text().length > 1){
              string = $(data[0]).text();
            }
            var node = data[0].prev;
            if (node != null && node.prev != null){
              object.number = count;
              object.headline = $(node.prev.children[0]).text();
              object.subject = string;
              object.date = nice_date;
              objects.push(object);
              count++;
            }
          }
        }
      });

      fs.writeFile('output/' + date+'.json', JSON.stringify(objects, null, 4), function(err){
        console.log('File successfully written! - Check your project directory for the file');
      })

      // res.json(objects);
    }

    else {
      console.log(error);
    }
  });
// });

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;