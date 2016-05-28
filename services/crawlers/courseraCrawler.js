var request = require('request');

function crawl(callback){
  var username = 'y7z9E7NnzXJzMMvHXi3opJReg5iLAEibmy0c7zD2',
    password = 'lA8TJhj2UO6Kf4af5ldbwnIcXPz6756FWgur1BRca3YeBMs3sFUrb0kqqEomEJ5t86jXrI1LsG80cppNiMNjoDsuM5S19MnfeZ2F8IJjaTEImuEoHsiiVoFQpCSPdX1g',
    url = 'http://' + username + ':' + password + '@www.udemy.com/api-2.0/courses';

  request({url: url}, function (err, response, body) {
     // Do more stuff with 'body' here
     console.log(body);
     callback(err);
  });
}
module.exports.run = function(callback){
  crawl(function(err){
    callback(err);
  })
}
