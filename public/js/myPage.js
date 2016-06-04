$(".course-title").click(function(){
  var url = $(this).data("url");
  window.location.href = url;
})

$(".view-btn").click(function(){
  var postId = $(this).data("postid");
  window.location.href = "/post?postId=" + postId;
})