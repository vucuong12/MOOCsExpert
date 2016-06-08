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
  if (!alreadyTaken) {
    return alert("You need to take this course first !");
  }
  window.location.href = "/postCreate?source=" + course.source + "&cid=" + course.cid;
})

$("#create-challenge-btn").click(function(){
  if (!alreadyTaken) {
    return alert("You need to take this course first !");
  }
  window.location.href = "/challenge/create?source="+course.source + "&id="+course.cid;
})

$(document).ready(function() {

})