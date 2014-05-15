$(function() {

  var fb = new Firebase("https://blazing-fire-9797.firebaseio.com/");

  // Voting

  var fbVote = fb.child("voting");

  function calculateScores(object) {
    var percentages = {};
    var totalVotes = object["vote-kd"] + object["vote-lj"];
    percentages.resultKd = object["vote-kd"] / totalVotes;
    percentages.resultLj = object["vote-lj"] / totalVotes;
    return percentages;
  }

  function convertToPercentage(number) {
    return (number * 100).toFixed(1) + "%";
  }

  fbVote.on("value", function(snapshot) {
    var scores = calculateScores(snapshot.val());
    $("#result-lj").html(convertToPercentage(scores.resultLj));
    $("#result-kd").html(convertToPercentage(scores.resultKd));
  });

  $("button.voting").click(function() {
    var vote = $(this).attr("id");
    fbVote.child(vote).transaction(function(votes) {
      return ++votes;
    });
    $("button.voting").hide();
    $("h3.voting-results").show();
  });

});
