var keystone = require('keystone');
var request = require('request');
var async = require('async');
var MyPost = keystone.list("MyPost");
var getIP = require('external-ip')();
var addMetadataForCourses = require("../../services/recommendation/addMetadataForCourses.js");
var updateRecommendationForUsers = require("../../services/recommendation/updateRecommendationForUsers.js");
module.exports = {

  create: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    locals.user = user || {};
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

        newMyPost.save(function(err, myPost){
          if (err){
            console.error(err);
          }
          callback(err, myPost._id, myPost);
        });

      },
      //update postIds in user
      function(myPostId, myPost, callback){
        keystone.list("User").model.findOne({_id: user._id}, function(err, user){
          var currentMyPosts = user.myPosts || [];
          currentMyPosts.push(myPostId);
          user.myPosts = currentMyPosts;
          user.save(function(err){
            callback(err, myPostId, myPost)
          })
        });
        
      },
      function(myPostId, myPost, callback){
        var query = {
          userId: user._id,
          cid: cid,
          source: source
        }
        keystone.list("MyCourse").model.findOne(query, function(err, myCourse){
          var currentMyPosts = myCourse.postIds || [];
          currentMyPosts.push(myPostId);
          myCourse.postIds = currentMyPosts;
          myCourse.save(function(err, myCourse){
            getIP(function (err, ip) {
              if (err) {
                // every service in the list has failed 
                throw err;
              }
              console.log(ip);
              callback(err, myPostId)
              //Update courseTags and postTags for this new myPost
              var port = process.env.PORT || "3000";
              var postUrl = "http://" + ip + ":" + port + "/post?postId=" + myPostId;
              addMetadataForCourses.getTagsByWaston(postUrl, "url", function(err, tags){
                removeWord(tags, "all rights reserved");
                removeWord(tags, "copyright");
                myPost.postTags = tags;
                keystone.list("Course").model.findOne({source:myCourse.source, cid: myCourse.cid}, function(err, course){
                  myPost.courseTags = course.titleTags.concat(course.tags.filter(function(n){
                    return course.titleTags.indexOf(n) === -1;
                  }))
                  myPost.tags = myPost.postTags.concat(myPost.courseTags.filter(function(n){
                    return myPost.postTags.indexOf(n) === -1;
                  }));
                  myPost.save(function(err, newMyPost){
                    updateRecommendationForUsers.updateOnNewPost(user._id, newMyPost._id, function(err){
                      console.log("Done updateOnNewPost (2)")
                    })
                  })
                })
              })
              
              
            });
            
          })
        });
      }
    ],
    function(err, myPostId){
      res.json({success: true, myPostId: myPostId})
    }) 
  }
}


function removeWord(words, word){
  var pos = words.indexOf(word);
  if (pos !== -1)
    words.splice(pos, 1);
}