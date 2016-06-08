var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '734991380257-dqmcogsc39rt7vj12cvbgthkbaf1k72p.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('customgg'));
  });
};

function attachSignin(element) {
  auth2.attachClickHandler(element, {},
      onSignIn, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
}

window.onload = function(){
  startApp();
};

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail());
  var xhr = new XMLHttpRequest();
  var username=profile.getName();
  username = username.replace(/[ ]+/g,'');
  var confirm_username = prompt("Enter your desire username",username);
  if (confirm_username!=null)
    username=confirm_username;
  var params = "email="+encodeURIComponent(profile.getEmail())+"&password="+encodeURIComponent(profile.getId())+"&username="+encodeURIComponent(username)+"&profilePicture="+encodeURIComponent(profile.getImageUrl());
  xhr.open('POST','/signinas',true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  xhr.onreadystatechange=function(){
  	if (xhr.readyState == 4 && xhr.status == 200) {
        var res = JSON.parse(xhr.responseText);
        if (res.success==true) {
          signOutGoogle();
        	window.location.pathname="/";
        } else {
        	alert("There is something wrong with Google Signin, please try again");
        	signOutGoogle();
        }
    } else if (xhr.readyState == 4 && xhr.status==404) {
    	alert("There is something wrong with Google Signin, use another service");
    	signOutGoogle();
    }
  }
}

function signOutGoogle() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}