var numOption = 0;
$(".addOption-btn").click(function(){
  var newTime = $("#newTime").val();
  var $h4 = $('<h4>').addClass("inline-ele").text("Option " + (++numOption) + ": " + newTime + " week(s)");
  var $i = $('<i>')
  .addClass("fa").addClass("fa-times").addClass("closeOption-btn");
  var $div = $('<div>').addClass("time-option").append($h4);
  $div.addClass("time-option").append($i).data("time", newTime);
  $(".time-option-list").append($div);
})
$(document).on("click", ".closeOption-btn", function(){
  $(this).closest(".time-option").remove();
})

$(".invite-btn").click(function(){
  
  $(".publish-btn").hide();
  $(".invite-section").show();
  $(".finish-btn").show();
})


$("#friend-search").autocomplete({
  minLength: 0,
  source: function(req, res){
    var value = $("#friend-search").val();
    if (value === "") return res([]);
    post("/quickSearch", {value: value}, function(result){
      if (result.success === true){
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
  }
  post("/challenge/inviteFriend", query, function(result){
    if (result.success){

    } else {
      alert("Cannot send invitation, try again !");
    }
  })
})

