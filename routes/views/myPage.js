var keystone = require("keystone");
var async = require("async");

exports = module.exports  = function(req, res){
  if (!req.user){
    return res.redirect("/signin");
  }
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;

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
          course.myPosts = [];

          async.each(myCourse.postIds,
          function(postId, callback){
            keystone.list("MyPost").model.findOne({_id: postId}).exec(function(err, myPost){
              course.myPosts.push(myPost);
              callback();
            })
          },
          function(err){
            locals.courseList.push(course);
            callback(err);  
          })

          
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
  view.render('myPage');
}