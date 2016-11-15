// Library source: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
// Northern Cyprus, Palestine, Kosovo, Somaliland

var basic_choropleth;
var index = 0;

function drawMap(){
    basic_choropleth = new Datamap({
        element: document.getElementById("container"),
        responsive: true,
        projection: 'equirectangular', // MERCATOR IS WRONG!!!!!
        data: all_countries,
        fills: {
            defaultFill: "#D3D3D3",
        },
        geographyConfig: {
            popupTemplate: function(geo, data) {
                var returnString = "";
                if (all_countries[geo.id] != null){
                    returnString = all_countries[geo.id];
                }
                else {
                    returnString = 0;    
                }
                return ['<div class="hoverinfo"><strong>' + geo.properties.name + '</strong>',
                    '<br/>Tweets: ' +  returnString + '',
                    '</div>'].join('');
            },
            highlightOnHover: true,
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2,
            highlightBorderOpacity: 1
        },
        done: function(basic_choropleth) {
            basic_choropleth.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                // console.log(geography.properties.name);
                for (i in data){
                    if (geography.id == data[i]["alpha-3"]){
                        // console.log(all_countries[data[i]["name"]] || "none");
                        // console.log(all_countries[data[i]["alpha-3"]] || "none");
                        // console.log(all_countries_tweets[data[i]["alpha-3"]] || "none");
                        if (all_countries[data[i]["alpha-3"]] > 0){
                            var tweetArray = all_countries_tweets[data[i]["alpha-3"]];
                            $('#tweets').text("");       
                            // $('#tweets').append("<br><br>");       
                            $('#tweets').append("<h1>"+geography.properties.name+"</h1>");       
                            for (index in tweetArray){
                                $('#tweets').append(tweetArray[index] + '<br>');
                                $('#tweets').append('<br>');
                                if (index == 5) break;
                            }
                            $('#tweets').show();    
                        }
                        else {
                            $('#tweets').text("");       
                            $('#tweets').hide();
                        }
                    }
                }
            });
        }
    });
}

function convertToHex(number){
    number = Math.round(200-(200/max)*number)+25;
    var hex = number.toString(16);
    var hexStr = "#00";
    if (number <= 16){
        hexStr += "0";
    }   
    hexStr += hex;
    hexStr += "10";
    return hexStr;
}

var all_countries = {};
var all_countries_tweets = {};
var color_country = {};
var max = -1;
var min = 1021029012029019120;

function colorCountries(){
    console.log("coloring countries");
    for (i in all_countries){
        if (all_countries[i] > max) {
            max = all_countries[i];
        }
        else if (all_countries[i] < min){
            min = all_countries[i];    
        }
    }
    for (i in all_countries){
        color_country[i] = convertToHex(all_countries[i]);
    }
    basic_choropleth.updateChoropleth(color_country);
}

function getData(callback){
    console.log("getting data");
    console.log(tweetsArray.length);
    for (var i = 0; i < tweetsArray.length; i++){
        for (var j = 0; j < data.length; j++){
            if (tweetsArray[i]["country"] == data[j]["alpha-2"]){
                if (all_countries[data[j]["alpha-3"]]){
                    all_countries[data[j]["alpha-3"]]+=1;
                    all_countries_tweets[data[j]["alpha-3"]].push(tweetsArray[i]["tweet"]);    
                }
                else {
                    all_countries[data[j]["alpha-3"]]=1;
                    all_countries_tweets[data[j]["alpha-3"]] = [];    
                    all_countries_tweets[data[j]["alpha-3"]].push(tweetsArray[i]["tweet"]);    
                }
            }
        }        
    }
    callback();
}

$(document).ready(function() {
    drawMap();
    getData(function(){
        colorCountries();
    });
    $('#tweets').hide();
});

// Resize
$(window).on('resize', function() {
    basic_choropleth.resize();
    $('#tweets').hide();
});

$("#tweets").click(function() {
    $('#tweets').hide();
});