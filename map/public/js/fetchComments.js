$( document ).ready( comments() )
function comments(){

  $.ajax({
    url: "/comments",
    type: "GET",
    datatype: "json"
  }).done(function(json){
    for(var i=json.length-1; i>=0; i--){
      $("#confirmation").append("<div class='comment'>"+
        "<p id='text'>"+json[i].text+"</p>"+
        "<p id='name'>"+"By "+json[i].name+" on "+json[i].date+"</p>"+
        "<div class='padding'></div>"+
        "</div>");
    }

  }).fail(function(xhr, status, error){
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  });
}



function subscribe(){

  var _name = $("#name").val();
  var _text = $("#text").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var _date = d.getDate() +'/'+ month + '/'+ d.getFullYear();

  $.ajax({
    url: "/subscribe",
    data: {
      name: _name,
      text: _text,
      date: _date
    },
    type: "GET",
    datatype: "json"
  }).done(function(json){
    $("#name").val("");
    $("#text").val("");
    var resp = 'thank you';
    $( ".comment" ).remove();

    for(var i=json.length-1; i>=0; i--){
      $("#confirmation").append("<div class='comment'>"+
        "<p id='text'>"+json[i].text+"</p>"+
        "<p id='name'>"+"By "+json[i].name+" on " + json[i].date+"</p>"+
        "<div class='padding'></div>"+
        "</div>");
    }

  }).fail(function(xhr, status, error){
    $("#confirmation").html("=(");
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  });
}

