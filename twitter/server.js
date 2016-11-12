var Twit = require('twit');
var request = require("request");
var twit_collection = [];



var options = {
  consumer_key : 'kij47kAvvt6tPIVit99ATR3kq',
  consumer_secret: 'yirA83ukpyt0QstxtJhIFnLzVU5xbOFWVXe7Q2oTlyGtdwLBpW',
  access_token: '408032569-GGR6Hba7RAbeFJx5CE7jKAYZ4BiXNhVmQmNGQGGj',
  access_token_secret: 'GpuKie9Asor6uAf9XImhFqjUDvCcRH2GxOkcfPNbuOyzX',
  timeout_ms: 60*1000 //we ensure a timeout of one minute after a HTTP request has failed
}

var bot = new Twit(options);
bot.get("search/tweets", {q:'emissions', count: 10}, function(error,data, response){
    //console.log(data.statuses);
    
    for(var result in data.statuses){
        console.log(result);
        var text = data.statuses[result].text;
        var user_name = data.statuses[result].user.name;

        var location = data.statuses[result].user.location;
        if (location){
          createData(location, text, user_name)
        }


    }

});

function createData(_location, _text, _user_name){
  
  var url = "https://maps.google.com/maps/api/geocode/json?address=" + _location + "&sensor=false";
  //console.log(url);

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {

          //console.log(body.results[0]); // Print the json response
          console.log("-------------------");
          if(body.status === "OK" ){
            var i = 0;
            for(i; i<body.results[0].address_components.length; i++){
              if (body.results[0].address_components[i].types[0]==="country"){
                var country = body.results[0].address_components[i].short_name;
                var twit_data = {user_name: _user_name, twit: _text, location: country, loc: _location};
                twit_collection.push(twit_data);
                console.log(_user_name);
                console.log(_text);
                console.log(country);
              
              }
            }
          }
      }
  })
             
}

