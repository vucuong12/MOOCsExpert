function upvote(postId, upIcon){
  var downIcon = $($(upIcon).closest(".col-xs-1").find("#downvote-icon1")[0]);
  upIcon = $(upIcon);
  if (!user){
    alert("You need to login to upvote this post !");
    return;
  }
	//console.log("upvote");
	//standard for using function: point display block should have id = <postId>+"point"
	var xhr = new XMLHttpRequest();
	xhr.open("GET","/updatepoint/"+postId+"/upvote?userid="+user._id,true);
	xhr.onreadystatechange=function(){
  		if (xhr.readyState == 4 && xhr.status == 200) {
  			var res = JSON.parse(xhr.responseText);
  			if (res.success) {
  				//console.log(res.point);
          console.log(res);
          console.log(res.type == -1);
          console.log(res.type == 1);
          if (res.type == -1) {
            downIcon.css("color","#00689b");
            upIcon.css("color","black")
          } else if (res.type == 1){
            console.log($("#upvote-icon1").css("color"));
            upIcon.css("color","#00689b");
            console.log($("#upvote-icon1").css("color"));
            downIcon.css("color","black");
          } else {
            console.log($("#upvote-icon1").css("color"));
            upIcon.css("color","black");
            console.log($("#upvote-icon1").css("color"));
            downIcon.css("color","black");
          }
  				document.getElementById(postId+"point").innerHTML = res.point;
  			}
  		}
  	}
	xhr.send(null);
}

function downvote(postId, downIcon){
  var upIcon = $($(downIcon).closest(".col-xs-1").find("#upvote-icon1")[0]);
  downIcon = $(downIcon);
  if (!user){
    alert("You need to login to downvote this post !");
    return;
  }
	//console.log("downvote");
	//standard for using function: point display block should have id = <postId>+"point"
	var xhr = new XMLHttpRequest();
	xhr.open("GET","/updatepoint/"+postId+"/downvote?userid=" + user._id,true);
	xhr.onreadystatechange=function(){
  		if (xhr.readyState == 4 && xhr.status == 200) {
  			var res = JSON.parse(xhr.responseText);
  			if (res.success) {
  				console.log("1 ");
          console.log(res);
          if (res.type == -1) {
            downIcon.css("color","#00689b");
            upIcon.css("color","black")
          } else if (res.type == 1){
            upIcon.css("color","#00689b");
            downIcon.css("color","black");
          } else {
            upIcon.css("color","black");
            downIcon.css("color","black");
          }
  				document.getElementById(postId+"point").innerHTML = res.point;
  			}
  		}
  	}
	xhr.send(null);
}
