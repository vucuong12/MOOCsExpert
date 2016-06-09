var keystone = require('keystone');
var request = require('request');
var async = require('async');
var Notification = keystone.list("Notification");
var Challenge = keystone.list("Challenge");
var MyCourse = keystone.list("MyCourse");

function takeCourse(req, res, source, cid, userId, callback){
  keystone.list("MyCourse").model.findOne({userId:userId, source:source,cid:cid}, function(err, mycourse){
    if (mycourse){
      return callback();
    }
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
      callback(err);
    })
  })
  
}

module.exports = {

  inviteFriend: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var friendName = req.body.friendName || null;
    var firstProposedTime = req.body.firstProposedTime;
    var cid = req.body.cid;
    var source = req.body.source;


    keystone.list("User").model.findOne({username: friendName}, function(err, friend){
      friend = friend || {};
      var challengeBody = {
        state: "PENDING",
        firstUserId: user._id,
        secondUserId: friend._id,
        firstProposedTime: firstProposedTime,
        secondProposedTime: [],
        cid: cid,
        source: source
      }
      //Create new challenge
      var newChallenge = new Challenge.model(challengeBody);
      newChallenge.save(function(err, myChallenge){
        if (err) {
          return res.json({success:false});
        } else {
          if (!friend._id){
            return res.json({success:true, challengeId:myChallenge._id});
          } 
          //Create new notification
          var notiBody = {
            userId: friend._id,
            content: "Challenge request from " + user.username,
            link: "/challenge/view?id=" + myChallenge._id
          } 
          var newNoti = new Notification.model(notiBody);
          newNoti.save(function(err){
            if (err){
              return res.json({success: false});
            } else {
              takeCourse(req, res, source, cid, user._id, function(err){
                if(err) return res.json({success:false})
                return res.json({success:true, challengeId:myChallenge._id});
              })
              
            }
          })
        }
      })
    })

  },

  updateOption: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var optionList = req.body.optionList;
    var challengeId = req.body.challengeId;
    var newUpdate = {};
    //Take course first if necessary
   
    keystone.list("Challenge").model.findOne({_id: challengeId}, function(err, challenge){
      if (user._id == challenge.firstUserId){
        challenge.firstProposedTime = optionList;
      } else {
        challenge.secondProposedTime = optionList;
      }
      challenge.save(function(err){
        if (err){
          res.json({success:false});
        } else {
          //Create new notification
          var notiBody = {
            userId: (user._id == challenge.secondUserId)? challenge.firstUserId:challenge.secondUserId,
            content: "New proposed time from your friend",
            link: "/challenge/view?id=" + challenge._id
          } 
          var newNoti = new Notification.model(notiBody);
          newNoti.save(function(err){
            if(err) return res.json({success:false})
            takeCourse(req, res, challenge.source, challenge.cid, user._id, function(err){
              if(err) return res.json({success:false})
              return res.json({success:true, challengeId:challenge._id});
            })
          })
        }

      })
    })

  },


  updateAgree: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var agree = req.body.agree;
    var challengeId = req.body.challengeId;
    var secondUserId = req.body.secondUserId;

    keystone.list("Challenge").model.findOne({_id: challengeId}, function(err, challenge){
      challenge.state = "ON-GOING";
      challenge.duration = agree; //in week(s)
      if (!challenge.secondUserId && user._id != challenge.firstUserId){
        challenge.secondUserId = user._id;
      }
      challenge.save(function(err){
        if (err){
          res.json({success:false});
        } else {
          //Create new notification
          var notiBody = {
            userId: (user._id == challenge.secondUserId)? challenge.firstUserId:challenge.secondUserId,
            content: "Agreement on proposed time for your challenge",
            link: "/challenge/view?id=" + challenge._id
          } 
          var newNoti = new Notification.model(notiBody);
          newNoti.save(function(err){
            if(err) return res.json({success:false})
            takeCourse(req, res, challenge.source, challenge.cid, user._id, function(err){
              if(err) return res.json({success:false})
              return res.json({success:true, challengeId:challenge._id});
            })
          })

          
        }

      })
    })

  },

  updateRefuse: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var challengeId = req.body.challengeId;

    keystone.list("Challenge").model.findOne({_id: challengeId}, function(err, challenge){
      challenge.state = "REMOVED";
      challenge.save(function(err){
        var notiBody = {
          userId: (user._id == challenge.secondUserId)? challenge.firstUserId:challenge.secondUserId,
          content: "You friend declined your invitation",
          link: "/challenge/view?id=" + challenge._id
        } 
        var newNoti = new Notification.model(notiBody);
        newNoti.save(function(err){
          if (err){
            res.json({success:false});
          } else {
            res.json({success:true, challengeId: challenge._id});
          }
        })
      })
    })
  },

  sendProposedTime: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var challengeId = req.body.challengeId;
    var secondProposedTime = req.body.proposedTime;

    keystone.list("Challenge").model.findOne({_id: challengeId}, function(err, challenge){
      challenge.state = "PENDING";
      challenge.secondUserId = user._id;
      challenge.secondProposedTime = secondProposedTime;
      challenge.save(function(err){
        if (err){
          res.json({success:false});
        } else {
          //Create new notification
          var notiBody = {
            userId: (user._id == challenge.secondUserId)? challenge.firstUserId:challenge.secondUserId,
            content: "Someone get interested in your challenge",
            link: "/challenge/view?id=" + challenge._id
          } 
          var newNoti = new Notification.model(notiBody);
          newNoti.save(function(err){
            if(err) return res.json({success:false})
            takeCourse(req, res, challenge.source, challenge.cid, user._id, function(err){
              if(err) return res.json({success:false})
              return res.json({success:true, challengeId:challenge._id});
            })
          })
        }

      })
    })
  }
}


