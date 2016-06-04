var keystone = require('keystone');
var request = require('request');
var async = require('async');
var MyPost = keystone.list("MyPost");

module.exports = {

  create: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var source = req.body.source;
    var cid = req.body.cid;
    var lessonIndex = req.body.lessonIndex || 0;
    var lessonName = req.body.lessonName;
    var title = req.body.title;
    var content = req.body.content;
    var courseTitle = req.body.courseTitle;

    async.waterfall([
      //create a new post instance from MyPost model
      function(callback){
        var newMyPost = new MyPost.model({
          userId : user._id,
          source : source,
          courseTitle: courseTitle,
          cid : cid,
          lessonIndex: lessonIndex,
          lessonName: lessonName,
          title: title,
          content: content
        });
        console.log(content);
        newMyPost.save(function(err, myPost){
          if (err){
            console.error(err);
          }
          callback(err, myPost._id);
        });

      },
      //update postIds in user
      function(myPostId, callback){
        keystone.list("User").model.findOne({_id: user._id}, function(err, user){
          var currentMyPosts = user.myPosts || [];
          currentMyPosts.push(myPostId);
          user.myPosts = currentMyPosts;
          user.save(function(err){
            callback(err, myPostId)
          })
        });
        
      },
      function(myPostId, callback){
        var query = {
          userId: user._id,
          cid: cid,
          source: source
        }
        keystone.list("MyCourse").model.findOne(query, function(err, myCourse){
          var currentMyPosts = myCourse.postIds || [];
          currentMyPosts.push(myPostId);
          myCourse.postIds = currentMyPosts;
          myCourse.save(function(err){
            callback(err, myPostId)
          })
        });
      }
    ],
    function(err, myPostId){
      res.json({success: true, myPostId: myPostId})
    }) 
  }
}