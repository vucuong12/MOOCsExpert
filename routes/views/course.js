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
  locals.data = {
    posts:[]
  }

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
  });
  view.on('init', function(next ) {
    keystone.list("MyPost").model.find({cid:courseId, source: courseSource})
    .exec(function(err,posts){
      locals.data.posts=posts;
      async.each(locals.data.posts,function(post,cb){
        keystone.list("User").model.findOne({_id:post.userId})
        .exec(function(err,res_user){
          post.author = res_user;
          cb();
        });
      },function(err){
        next();
      });
    }); 
  }); 
  view.render('course');
};
