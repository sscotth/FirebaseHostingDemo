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

  // Chat

  var fbChat = fb.child("chat");
  var maxMessages = 20;
  var fbChatMessages = fbChat.endAt().limit(maxMessages);

  function updateChat(name, text) {
    var $chatMessages = $("#chat-room").children();
    addChatMessage(name, text);
    if ($chatMessages.length + 1 > maxMessages) {
      removeLastChatMessage($chatMessages);
    }
  }

  function removeLastChatMessage($messages) {
    $messages.first().remove();
  }

  function addChatMessage(name, text) {
    $("<div>")
      .text(text)
      .prepend($("<strong>")
      .text(name + ": "))
      .appendTo($("#chat-room"));
  }

  fbChatMessages.on("child_added", function(snapshot) {
    var msg = snapshot.val();
    updateChat(msg.name, msg.text);
  });

  $("#chat-message").keypress(function(e) {
    var enterKeyCode = 13;
    if (e.keyCode === enterKeyCode) {
      sendMsg();
    }
  });

  $("#chat-submit").click(function(e) {
    event.preventDefault();
    sendMsg();
  });

  function sendMsg() {
    var name = $("#chat-name").val();
    var text = $("#chat-message").val();

    if (name !== "" && text !== "") {
      fbChat.push({ name: name, text: text });
      $("#chat-message").val("");
    }
  }
});
