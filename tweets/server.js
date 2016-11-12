var Twit    = require('twit');
var request = require("request");
var fs      = require('fs');

var Data = function(){
  this.id;
  this.user_name;
  this.tweet;
  this.country;
  this.detailed_location;
  this.date;
}

var objects = [];
var d = new Date();
var day = d.getDate();
var month = d.getMonth()+1;
var year = d.getFullYear();
var date = day+ '' + month+ '' +year;
var nice_date = day+ '/' + month+ '/' +year;

var options = {
  consumer_key : 'kij47kAvvt6tPIVit99ATR3kq',
  consumer_secret: 'yirA83ukpyt0QstxtJhIFnLzVU5xbOFWVXe7Q2oTlyGtdwLBpW',
  access_token: '408032569-GGR6Hba7RAbeFJx5CE7jKAYZ4BiXNhVmQmNGQGGj',
  access_token_secret: 'GpuKie9Asor6uAf9XImhFqjUDvCcRH2GxOkcfPNbuOyzX',
  timeout_ms: 60*1000 //we ensure a timeout of one minute after a HTTP request has failed
}

var bot = new Twit(options);
bot.get("search/tweets", {q:'politics', count: 10000}, function(error,data,response){  
  if (error) console.log(error);
  for(var result in data.statuses){
    if (location){
      var tweetId = data.statuses[result].id;
      var text = data.statuses[result].text;
      var user_name = data.statuses[result].user.name;
      var location = data.statuses[result].user.location;
      createData(location, text, user_name, tweetId)
    }
  }
});

function createData(location, text, user_name, tweetId){
  
  var url = "https://maps.google.com/maps/api/geocode/json?address=" + location + "&sensor=false";

  request({
      url: url,
      json: true
  }, 
  function (error, response, body) {
    if (error) console.log(error);
    if (!error && response.statusCode === 200) {
      if(body.status === "OK" ){
        for(var i=0; i<body.results[0].address_components.length; i++){
          if (body.results[0].address_components[i].types[0]==="country"){
            var country = body.results[0].address_components[i].short_name;
            var data = new Data();
            data.id = tweetId;
            data.user_name = user_name;
            data.tweet = text;
            data.country = country;
            data.detailed_location = location;
            data.date = nice_date;
            objects.push(data);
            fs.writeFile('output/' + date+'.json', JSON.stringify(objects, null, 4), function(err){
              if (err) console.log(err);
              // else console.log('File successfully written! - Check your project directory for the file');
            })
          }
        }
      }
    }
  })
}