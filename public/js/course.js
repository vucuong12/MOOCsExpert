var TAKE_COURSE_ENDPOINT = "/update/takecourse";

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

$("#take-course-btn").click(function(){
  if (!user){
    window.location.href = "/signin";
    return;
  }
  var data = {
    userId : user._id,
    source : course.source,
    cid : course.cid
  }
  post(TAKE_COURSE_ENDPOINT, data, function(data){
    if (data.success === true){
      location.reload();
    } else {
      alert("Error while adding, try again !");
    }
  })
})

$(document).ready(function() {

})