function post(endpoint, data, cb) {
  return $.ajax({
    url: endpoint,
    type: "POST",
    data: data,
    success: function(data) {
      cb(data);
    }
  });
}

function get(endpoint, cb, errCb) {
  return $.ajax({
    url: endpoint,
    type: "GET",
    success: function(data) {
      cb(data);
    },
    error: function (xhr, ajaxOptions, thrownError) {
      errCb(xhr, ajaxOptions, thrownError);
    }
  });
}


$("#search-box").autocomplete({
    minLength: 0,
    source: function(req, res){
      var value = $("#search-box").val();
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
        $("#search-box").val(ui.item.name);
        return false;
    },
    select: function (event, ui) {
        $("#search-box").val(ui.item.name);
        window.location.href = "/user/" + ui.item.name;
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
        .append("<a>User: " + item.name + "</a>")
        .appendTo(ul);
  };


var notis;

function displayNoti(){
  var query = {};
  post("/notification/get", query, function(result){
    if (result.success === true){
      notis = result.notis;
      var newNoti = 0;
      for (var i in notis){
        var noti = notis[i];
        if (!noti.isViewed){
          newNoti++;
        }
      }
      var notiButtonPos = $("#noti-icon").offset();
      notiButtonPos.top = 0;
      notiButtonPos.left += 30;
      var $newNotiIcon = $("<h3>")
      .addClass("red-noti")
      .css("position","absolute")
      .css("color","yellow")
      .css("border-radius","100%")
      .css("padding", "2px")
      .css("background-color","red")
      .css("z-index", "10000")
      .css("margin-top", "0")
      .offset(notiButtonPos)
      .text(newNoti);
      if (newNoti !== 0)
        $("body").append($newNotiIcon);
    } else {
      console.log(11);
    }
  })
}

$("#noti-icon").click(function(){
  $(".red-noti").hide();
  post("notification/viewedAll", {}, function(result){
  })
  $("#noti-drop-menu").empty();
  for (var i in notis){
    var noti = notis[i];
    $("<li>").append($("<a>").attr("href","#").text(noti.content)).appendTo("#noti-drop-menu");
  }

})

$(document).ready(function() {
  if (user)
    displayNoti();
})


