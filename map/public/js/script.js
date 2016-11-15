// Library source: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
// Northern Cyprus, Palestine, Kosovo, Somaliland

var basic_choropleth;

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
                console.log(geography.properties.name);
            });
        }
    });
}

function convertToHex(number){
    number = Math.round(255-(255/max)*number);
    var hex = number.toString(16);
    var hexStr = "#00";
    if (number <= 16){
        hexStr += "0";
    }   
    hexStr += hex;
    hexStr += "00";
    return hexStr;
}

var all_countries = {};
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
    for (j in data){
        all_countries[data[j]["alpha-3"]] = Math.round(10000*Math.random(1000));
    }
    console.log(j);
    callback();
}

$(document).ready(function() {
    drawMap();
    getData(function(){
        colorCountries();
    });
});

// Resize
$(window).on('resize', function() {
   basic_choropleth.resize();
});