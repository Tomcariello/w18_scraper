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
  // empty the (new) note form
  $('#notes').empty();
  // save the id from the p tag
  var thisId = $(this).attr('data-id');

  // now make an ajax call for the Article information to populate notes field
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
  .done(function( data ) {
    //Clear the notes form
    $('#notes').append('<h2>' + data.title + '</h2>'); 
    $('#notes').append('<input id="titleinput" name="title" >'); 
    $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
    $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

    //write the notes to the screen
    for (var i = 0; i < data.Notes.length; i++) {
      // $('#usernotes').append('<hr>');
      $('#usernotes').append('<h3>' + data.Notes[i].title + '</h3>'); 
      $('#usernotes').append('<p>' + data.Notes[i].body + '</p>'); 
      $('#usernotes').append('<p id="deleteNote" data-id=' + data.Notes[i]._id + '>Delete this note.</p>'); 
    }
  })
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
      console.log(data);
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});

// when you click a deleteNote class
$(document).on('click', '#deleteNote', function(){
  var thisId = $(this).attr('data-id');
  // var baseURL = window.location.origin;
  // AJAX Call to delete Comment
  $.ajax({
    url: "deletenote/" + thisId,
    type: 'POST',
  })
  .done(function() {
    // Refresh Window after the call is done
    location.reload();
  });
  
  // Prevent Default
  return false;
});
