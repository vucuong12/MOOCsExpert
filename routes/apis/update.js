var keystone = require('keystone');
var request = require('request');
var async = require('async');
var MyCourse = keystone.list("MyCourse");
var updateRecommendationForUser = require("../../services/recommendation/updateRecommendationForUsers.js");


module.exports = {

  takeCourse: function (req, res) {
    var locals = res.locals;
    var userId = req.body.userId;
    var source = req.body.source;
    var cid = req.body.cid;
    if (!req.user) return res.redirect("/signin");
    async.waterfall([
      function(callback){
        var newMyCourse = new MyCourse.model({
          userId : userId,
          source : source,
          cid : cid
        });
        newMyCourse.save(function(err, myCourse){
          callback(err, myCourse._id, myCourse);
        });

      },
      function(myCourseId, myCourse, callback){
        keystone.list("User").model.findOne({_id: userId}, function(err, user){
          var currentMyCourses = user.myCourses || [];
          currentMyCourses.push(myCourseId);
          user.myCourses = currentMyCourses;
          user.save(function(err){
            callback(err);  
            updateRecommendationForUser.updateOnNewCourse(user._id, myCourse.source, myCourse.cid, function(err){
              
              console.log("Finish updating recommendation on new Course");
            })
            
          })
        });
        
      }
    ],
    function(err){
      res.json({success: true})
    })

    
    
  }
}