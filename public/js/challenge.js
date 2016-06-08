var numOption = 0;
$(".addOption-btn").click(function(){
  var newTime = $("#newTime").val();
  var $h4 = $('<h4>').addClass("inline-ele").text("Option " + (++numOption) + ": " + newTime + " week(s)");
  var $i = $('<i>').addClass("fa").addClass("fa-times").addClass("closeOption-btn");
  var $div = $('<div>').addClass("time-option").data("time", newTime);
  $div.append($h4);
  $div.append($i);
  $(".time-option-list").append($div);
})
$(document).on("click", ".closeOption-btn", function(){
  $(this).closest(".time-option").remove();
})

$(".invite-btn").click(function(){

  $(".invite-section").show();
  $(".finish-btn").show();
})


if ($("#friend-search").length > 0)
$("#friend-search").autocomplete({
  minLength: 0,
  source: function(req, res){
    var value = $("#friend-search").val();
    if (value === "") return res([]);
    post("/quickSearch", {value: value}, function(result){
      if (result.success === true){
        for (var i in result.data){
          if (user.username === result.data[i].name){
            result.data.splice(i,1);
            break;
          }
        }
        
        res(result.data);
      } else {
        alert("quichSearch error. Try again !");
      }
    })
  },
  focus: function (event, ui) {
      $("#friend-search").val(ui.item.name);
      return false;
  },
  select: function (event, ui) {
      $("#friend-search").val(ui.item.name);
      //window.location.href = "/user/" + ui.item.name;
      return false;
  },
  open: function(){

      $(this).autocomplete('widget').zIndex(10000);
      return false;
  }
})
  .data("ui-autocomplete")._renderItem = function (ul, item) {

  return $("<li>")
      .data("ui-autocomplete-item", item)
      .append("<a data-id=" +item.id + ">User: " + item.name + "</a>")
      .appendTo(ul);
};

$(".finish-btn").click(function(){
  var friendName = $("#friend-search").val();
  var temp = [];
  $(".time-option").each(function(){
    temp.push($(this).data("time"));
  })
  var query = {
    friendName: friendName,
    firstProposedTime:temp,
    source: $(this).data("source"),
    cid: $(this).data("cid")
  }
  post("/challenge/inviteFriend", query, function(result){
    if (result.success){
      window.location.href = "/challenge/view?id=" + result.challengeId;
    } else {
      alert("Cannot send invitation, try again !");
    }
  })
})


$("#update-time-option").click(function(){
  var optionList = [];
  $(".my-list .time-option").each(function(){
    optionList.push($(this).data("time"));
  })

  var query = {
    challengeId: JSON.parse($("#view-challenge-page").data("challengeid")),
    optionList: optionList
  }
  post("/challenge/updateOption", query, function(result){
    if (result.success){
      window.location.href = "/challenge/view?id=" + result.challengeId;
    } else {
      alert("Cannot send invitation, try again !");
    }
  })
})

$(".friendProposed .agree-btn").click(function(){
  var agree = $('input[name=time-option-radio]:checked').val();
  if (agree === "not-agree"){
    location.reload();
    return;
  }
  var query = {
    challengeId: JSON.parse($("#view-challenge-page").data("challengeid")),
    agree: agree
  }

  if (query.agree)
  post("/challenge/updateAgree",query, function(result){

    if (result.success === true){
      window.location.href = "/challenge/view?id=" + result.challengeId;
    } else {
      alert("Error in updating agreement on time for challenge !");
    }
  })
  else {
    alert("Please choose one option !")
  }
})

$(".friendProposed .decline-btn").click(function(){
  var query = {
    challengeId: JSON.parse($("#view-challenge-page").data("challengeid")),
  }
  post("/challenge/updateRefuse",query, function(result){
    if (result.success === true){
      window.location.href = "/";
    } else {
      alert("Error in updating agreement on time for challenge !");
    }
  })
})

$(".publish-btn").click(function(){
  var temp = [];
  $(".time-option").each(function(){
    temp.push($(this).data("time"));
  })
  var query = {
    firstProposedTime:temp,
    source: $(this).data("source"),
    cid: $(this).data("cid")
  }
  post("/challenge/inviteFriend", query, function(result){
    if (result.success){
      window.location.href = "/challenge/view?id=" + result.challengeId;
    } else {
      alert("Cannot send invitation, try again !");
    }
  })
})

$("#send-proposed-time-btn").click(function(){
  var temp = [];
  $(".myProposed .time-option").each(function(){
    temp.push($(this).data("time"));
  })

  if (temp.length === 0){
    return alert("Choose at least one option");
  }
  var query = {
    challengeId: JSON.parse($("#view-challenge-page").data("challengeid")),
    proposedTime:temp
  }
  post("/challenge/sendProposedTime", query, function(result){
    if (result.success){
      window.location.href = "/challenge/view?id=" + result.challengeId;
    } else {
      alert("Cannot send invitation, try again !");
    }
  })
})

$(".negotiate-btn").click(function(){
  $("#negotiate-section").toggle();
})

