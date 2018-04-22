$(document).ready(function() {
  // Grab the articles as a json
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='panel $panel-item-border'>" + "<div class='panel-heading' data-id=' " + data[i]._id + " ' " + data[i].summary + "</div>");
    }
  });

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    // With that done, add the comment information to the page
    .done(function(data) {
      $('.commentTitle').text(data.headLine);
      if (data.comment.length===0) {
        $(".comments").append("<h5>Article has no comments!</h5>");
      } 
      else {
        $(".comments").append("<h5>Saved comments</h5>");
        data.comment.forEach(function(item){
          // The title of the article
          $(".comments").append("<p><strong>Title: </strong>" + item.title + " <button data-id='"+item._id+"'class='btn btn-dark delcomment float-right'><i class='fa fa-trash-o' aria-hidden='true'></i></button><br>"+ item.body+"</p>");
        });
        }  

      // An input to enter a new title
        $(".commentPad").append("<h5>Add comment</h5><input id='titleinput' name='title' class='mb-3 form-control'><br>");
        // A textarea to add a new comment body
        $(".commentPad").append("<textarea class='form-control' id='bodyinput' name='body'></textarea><br>");
        // A button to submit a new comment, with the id of the article saved to it
        $(".commentPad").append("<button class='btn btn-dark mt-3' data-id='" + data._id + "' id='savecomment'>Save comment</button>");

    });
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the comments from the comment section
    $("#comments").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the comment information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#comments").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#comments").append("<input id='titleinput' name='title' >");
        // A textarea to add a new comment body
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new comment, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save comment</button>");

        // If there's a comment in the article
        if (data.comment) {
          // Place the title of the comment in the title input
          $("#titleinput").val(data.comment.title);
          // Place the body of the comment in the body textarea
          $("#bodyinput").val(data.comment.body);
        }
      });
  });

  // When you click the savecomment button
  $(document).on("click", "#savecomment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from comment textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the comments section
        $("#comments").empty();
      });

    // Also, remove the values entered in the input and textarea for comment entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#addcomment", function() {
  $('.commentTitle').text('Article comments');
  $('.commentPad').empty();
  $('.comments').empty();
  $('.commentModal').modal('toggle');

  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
});