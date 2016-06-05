var keystone = require('keystone');
var request = require('request');
var async = require('async');

var udemyName = 'y7z9E7NnzXJzMMvHXi3opJReg5iLAEibmy0c7zD2',
    udemyPassword = 'lA8TJhj2UO6Kf4af5ldbwnIcXPz6756FWgur1BRca3YeBMs3sFUrb0kqqEomEJ5t86jXrI1LsG80cppNiMNjoDsuM5S19MnfeZ2F8IJjaTEImuEoHsiiVoFQpCSPdX1g';



exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var query = req.query.query;
  
    // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'search';

  view.on('init', function(next) {
    async.waterfall([
      udemySearch,
      courseraSearch,
    ],function(err, finalList){
      finalList = reorder(finalList);
      // Render the view
      locals.results = finalList;
      locals.query = query;
      locals.type = "normalSearch";
      next();
    })
  })

  //Get udemy courses
  function udemySearch(callback){
    var url = 'http://' + udemyName + ':' + udemyPassword + '@www.udemy.com/api-2.0/courses?page_size=100&search=' + query;
    request({url:url}, function(err, response, body){
      body = JSON.parse(body);
      if (!err && response.statusCode === 200){
        var results = body.results;
        var courseList = [];
        for (var index in results){
          var course = results[index];
          var newCourse = {
            cid: course.id,
            smallImageUrl: course.image_240x135,
            title: course.title,
            source: "Udemy"
          }
          courseList.push(newCourse);
        }
        callback(null, [courseList]); 
      } else {
        callback(null, []);  
      }
      
    })
  }

  function courseraSearch(currentList, callback){
    var url = "https://api.coursera.org/api/courses.v1?q=search&fields=photoUrl&query=" + query;
    request({url: url}, function (err, response, body) {
      body = JSON.parse(body);
      if (!err && response.statusCode === 200){
        var results = body.elements;
        var courseList = [];
        for (var index in results){
          var course = results[index];
          var newCourse = {
            cid: course.id,
            smallImageUrl: course.photoUrl,
            title: course.name,
            source: "Coursera"
          }
          courseList.push(newCourse);
        }
        currentList.push(courseList);
        callback(null, currentList);
      } else {
        callback(null, currentList);  
      }

    }); 
  }

  function reorder(arrayList){
    var result = [];
    while (1){
      var totalLength = 0;
      for (var i in arrayList){
        totalLength += arrayList[i].length;
        if (arrayList[i].length > 0)
          result.push(arrayList[i].shift());
      }
      if (totalLength === 0)
        break;
    }
      
    return result;
  }
  
  view.render('search/search');
};
