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
        //get info of each course
        var promise1 = keystone.list("Course").model.findOne(query).sort({createdAt:'desc'});
        promise1.lean().exec(function(err, course){
          course.myPosts = [];
          //for each course, get myPosts
          keystone.list("MyPost").model.find({userId:user._id, source:course.source, cid: course.cid}, function(err, myPosts){
            if (err){
              return res.redirect('/404-page-not-found');
            }
            course.myPosts = myPosts;
            //for each course, get myChallenges
            keystone.list("Challenge").model.findOne({$or:[{firstUserId:user._id},{secondUserId:user._id}],state: {$ne: "REMOVED"},source:course.source, cid: course.cid}, function(err, challenge){
              if (err){
                return res.redirect('/404-page-not-found');
              }
              course.myChallenge = challenge;
              if (!challenge){
                locals.courseList.push(course);
                return callback();
              }
              //Find your friend name
              var friendId = challenge.firstUserId;
              if (user._id === challenge.firstUserId) friendId = secondUserId;
              keystone.list("User").model.findOne({_id: friendId}, function(err, friend){
                course.friendName = friend.username;
                locals.courseList.push(course);
                callback();
              })
              
            })
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