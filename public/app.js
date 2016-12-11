// grab the articles as a json and post title/hyperlink
$.getJSON('/articles', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#articles').append(
      '<p data-id="' + 
      data[i]._id + '"><a target="new" href="' + 
      data[i].link + '">' + 
      data[i].title +
      '</p>');
  }
});


// whenever someone clicks a link
$(document).on('click', 'p', function(){
  // empty the (new) notes from the note section of any previously loaded notes
  $('#notes').empty();
  // save the id from the p tag
  var thisId = $(this).attr('data-id');

  // now make an ajax call for the Article information to populate labels in the notes field
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      $('#notes').append('<h2>' + data.title + '</h2>'); 
      $('#notes').append('<input id="titleinput" name="title" >'); 
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');


      //MAKE AJAX CALL FOR NOTES
      $.ajax({
        method: "GET",
        url: "/notes/" + thisId,
      })
        .done(function( notedata ) {
          for (var i = 0; i < notedata.length; i++) {
            //Add code to parse the data once it is returning properly
            $('#usernotes').append('<h2>' + notedata[i].title + '</h2>'); 
            $('#usernotes').append('<h2>' + notedata[i].body + '</h2>'); 
          }
        })


    });
});

// when you click the savenote button
$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  // run a POST request to create a new note using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      // console.log(data);
      // $('#notes').empty();
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});
