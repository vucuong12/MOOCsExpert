var TAKE_COURSE_ENDPOINT = "/update/takecourse";



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

$("#create-post-btn").click(function(){
  window.location.href = "/postCreate?source=" + course.source + "&cid=" + course.cid;
})

$(document).ready(function() {

})