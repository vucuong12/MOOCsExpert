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



