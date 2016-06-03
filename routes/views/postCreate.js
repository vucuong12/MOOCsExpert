var keystone = require('keystone');
var async = require("async");

exports = module.exports = function(req, res) {
  if (!req.user) {
    return res.redirect('/signin');
  }
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;
  locals.user = req.user || null;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'postCreate';
  view.on("init", function(next){
    locals.courseList = [];

    var promise = keystone.list("MyCourse").model.find({userId:user._id});
    promise.lean().exec(function(err, myCourses){
      async.each(myCourses,
      function(myCourse, callback){
        var query = {
          source : myCourse.source,
          cid : myCourse.cid
        }
        var promise1 = keystone.list("Course").model.findOne(query);
        promise1.lean().exec(function(err, course){
          var myCourse = {};
          myCourse.source = course.source;
          myCourse.cid = course.cid;
          myCourse.selected = (course.source === req.query.source && course.cid === req.query.cid);
          myCourse.name = course.title + " - " + course.source;
          if (course.source === "Udemy"){
            myCourse.lessons = JSON.parse(course.lessons) || [];
          } else {
            myCourse.lessons = [];
          } 
          if (myCourse.selected){
            locals.couresList.unshift(myCourse);
          } else{
            locals.courseList.push(myCourse);  
          }
          
          callback(err);
        })
      },
      function(err){
        if (err) {
          console.error(err);
        }
        next();
      })
    })
  })
  // Render the view
  view.render('postCreate');
  
};
