var Twit     = require('twit');
var request  = require("request");
var fs       = require('fs');
var natural  = require('natural');
var sw       = require('stopword');
var jsonfile = require('jsonfile');

var options = {
  consumer_key : 'kij47kAvvt6tPIVit99ATR3kq',
  consumer_secret: 'yirA83ukpyt0QstxtJhIFnLzVU5xbOFWVXe7Q2oTlyGtdwLBpW',
  access_token: '408032569-GGR6Hba7RAbeFJx5CE7jKAYZ4BiXNhVmQmNGQGGj',
  access_token_secret: 'GpuKie9Asor6uAf9XImhFqjUDvCcRH2GxOkcfPNbuOyzX',
  timeout_ms: 60*1000 //we ensure a timeout of one minute after a HTTP request has failed
}

// var options = {
//   consumer_key : 'crV7izNAuKmgvfW5Lm4RPVIBN',
//   consumer_secret: 'DGd859OYdzNMlaBLhSXkbZx7nJu3H8X9jOV2rXCEOCSuTR27D9',
//   access_token: '781425260595937282-PwfzN2SzuQ4p7bj7wD3y5XPnw4JJZYZ',
//   access_token_secret: 'ek9R3mjTp1u1Qba8iUwLaLodtHslVAXt3ewd9EjSUpsBf',
//   timeout_ms: 60*1000 //we ensure a timeout of one minute after a HTTP request has failed
// }

var bot = new Twit(options);

var tokenizer = new natural.WordTokenizer();

var Data = function(){
  this.id;
  this.user_name;
  this.tweet;
  this.country;
  this.detailed_location;
  this.date;
}

var generalObjects = [];
var d = new Date();
var day = d.getDate();
var month = d.getMonth()+1;
var year = d.getFullYear();
var date = day+ '' + month+ '' +year;
var nice_date = day+ '/' + month+ '/' +year;
var oldM = -10;

var file = 'output/141120160.json';
var combinations = [];

function makeCombinations(){
  jsonfile.readFile('../scrape/output/14112016.json', function(err, obj) {
    if (err) {
      console.log(err + ' ');
    }
    else {
      var title = obj[8]["headline"].replace('UN',"United Nations");
      var subject = obj[8]["subject"];
      var filteredTitle = sw.removeStopwords(tokenizer.tokenize(title));
      var filteredSubject = sw.removeStopwords(tokenizer.tokenize(subject));
      mix(filteredTitle, filteredSubject);
    }
  });
}

function mix(title, subject){
  combinations.push(subject[0]+" "+subject[1]);
  combinations.push(subject[0]+" "+subject[1] + " " + "United Nations");
  combinations.push(subject[0]+ " United Nations");
  combinations.push(subject[1]+ " United Nations");
  combinations.push(subject[1]+ " United Nations");
  combinations.push(title[0] + " " + title[1] + " " + title[2]);
  combinations.push(title[3] + " " + title[4] + " " + title[5]);
  combinations.push(title[6] + " " + title[7] + " " + title[8]);
  combinations.push(title[8] + " " + title[9] + " " + title[10]);
  combinations.push(title[1] + " " + title[3] + " " + title[5]);
  var i = Math.round(10*Math.random());
  getTweets(combinations[0]);

}

function readFiles(data){
  var object;
  jsonfile.readFile(file, function(err, obj) {
    if (err) {
      console.log(err + ' ');
    }
    else {
      object = obj;
      for (i in object){
        if (object[i].id == data.id){
          return;
        }
      }
      object.push(data);
      writeFiles(object);
    }
  });
}

function writeFiles(object){
  jsonfile.writeFileSync(file,object,{spaces: 2});
}

function getTweets(string, object){
  bot.get("search/tweets", {q:string, count: 1000}, function(error,data,response){  
    if (error) {
      console.log(error.statusCode);
    }
    for(var result in data.statuses){
      if (data.statuses[result].text.substr(0,2) != "RT"){
        if (data.statuses[result].user.location != null){
          var tweetId = data.statuses[result].id;
          var text = data.statuses[result].text;
          var user_name = data.statuses[result].user.name;
          var location = data.statuses[result].user.location;
          createData(location, text, user_name, tweetId, object);
        }
      }
    }
  });
}

function createData(location, text, user_name, tweetId, object){
  var url = "https://maps.google.com/maps/api/geocode/json?address=" + location + "&sensor=false";
  request({
      url: url,
      json: true
  }, 
  function (error, response, body) {
    if (error) {
      console.log(error + "2");
    }
    if (!error && response.statusCode === 200) {
      if(body.status === "OK" ){
        for(var i=0; i<body.results[0].address_components.length; i++){
          if (body.results[0].address_components[i].types[0]==="country"){
            var country = body.results[0].address_components[i].short_name;
            var data = new Data();
            data.id = ""+tweetId;
            data.user_name = ""+user_name;
            data.tweet = ""+text;
            data.country = ""+country;
            data.detailed_location = ""+location;
            data.date = ""+nice_date;
            if (data){
              readFiles(data);
            }
          }
        }
      }
    }
  });
}

makeCombinations();
// getTweets("Cat");
// getTweets("health and poverty");

// function replacements(){
//   var object
//   var newObject = [];
//   jsonfile.readFile(file, function(err, obj) {
//     if (err) {
//       console.log(err + ' ');
//     }
//     else {
//       object = obj;
//       for (i in object){
//         var match = false;
//         for (j in newObject){
//           if (object[j].id == object[i].id){
//             // object.remove(j);
//             match = true;
//           }
//         }
//         if (match == false){
//           newObject.push(object[i]);
//         }
//       }
//       jsonfile.writeFileSync(file,newObject, {spaces:2});
//     }
//   });
// }

// replacements();