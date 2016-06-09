function upvote(postId){
	//console.log("upvote");
	//standard for using function: point display block should have id = <postId>+"point"
	var xhr = new XMLHttpRequest();
	xhr.open("GET","/updatepoint/"+postId+"/upvote",true);
	xhr.onreadystatechange=function(){
  		if (xhr.readyState == 4 && xhr.status == 200) {
  			var res = JSON.parse(xhr.responseText);
  			if (res.success) {
  				//console.log(res.point);
  				document.getElementById(postId+"point").innerHTML = res.point;
  			}
  		}
  	}
	xhr.send(null);
}

function downvote(postId){
	//console.log("downvote");
	//standard for using function: point display block should have id = <postId>+"point"
	var xhr = new XMLHttpRequest();
	xhr.open("GET","/updatepoint/"+postId+"/downvote",true);
	xhr.onreadystatechange=function(){
  		if (xhr.readyState == 4 && xhr.status == 200) {
  			var res = JSON.parse(xhr.responseText);
  			if (res.success) {
  				//console.log(res.point);
  				document.getElementById(postId+"point").innerHTML = res.point;
  			}
  		}
  	}
	xhr.send(null);
}