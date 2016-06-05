function followUser() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET",window.location.pathname +"/action/follow",false);
	xmlHttp.send(null);
	location.reload();
}

function unFollowUser() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET",window.location.pathname +"/action/unfollow",false);
	xmlHttp.send(null);
	location.reload();
}