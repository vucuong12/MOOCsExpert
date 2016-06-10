//update this user statistic
function updateUserStats(){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET",window.location.pathname +"/update_stats",true);
	xmlHttp.send(null);
};

updateUserStats();
