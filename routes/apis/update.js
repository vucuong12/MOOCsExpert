var keystone = require('keystone');
var request = require('request');
var async = require('async');
var MyCourse = keystone.list("MyCourse");

module.exports = {

  takeCourse: function (req, res) {
    var locals = res.locals;
    var userId = req.body.userId;
    var source = req.body.source;
    var cid = req.body.cid;

    async.waterfall([
      function(callback){
        var newMyCourse = new MyCourse.model({
          userId : userId,
          source : source,
          cid : cid
        });
        newMyCourse.save(function(err, myCourse){
          callback(err, myCourse._id);
        });

      },
      function(myCourseId, callback){
        keystone.list("User").model.findOne({_id: userId}, function(err, user){
          var currentMyCourses = user.myCourses || [];
          currentMyCourses.push(myCourseId);
          user.myCourses = currentMyCourses;
          user.save(function(err){
            callback(err)
          })
        });
        
      }
    ],
    function(err){
      res.json({success: true})
    })

    
    
  }
}