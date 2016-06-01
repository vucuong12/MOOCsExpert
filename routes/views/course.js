var keystone = require('keystone');
var request = require('request');
var async = require('async');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var query = req.query.query;
  var courseSource = req.query.source;
  var courseId = req.query.id;
  locals.user = req.user || null;

  view.on('init', function(next ) {
    var promise = keystone.list("Course").model.findOne({source: courseSource, cid: courseId});
    promise.lean().exec(function(err, course){
      course.lessons = JSON.parse(course.lessons);
      course.instructors = JSON.parse(course.instructors);
      if (course.source === "Coursera"){
        course.description = course.description.replace("<p>", "");
        course.description = course.description.replace("</p>", "");

      }
      locals.course = course;
      if (locals.user)
        keystone.list("MyCourse").model.find({userId: locals.user._id}, function(err, myCourses){
          for (var i in myCourses){
            var myCourse = myCourses[i];
            if (myCourse.source === course.source && myCourse.cid === course.cid){
              locals.alreadyTaken = true;
              return next();
            }
          }
          locals.alreadyTaken = false;
          next();
        })
      else 
        next();
    })  
  })  
  view.render('course');
};
