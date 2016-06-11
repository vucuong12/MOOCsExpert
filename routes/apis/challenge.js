var keystone = require('keystone');
var request = require('request');
var async = require('async');
var Notification = keystone.list("Notification");
var Challenge = keystone.list("Challenge");
var MyCourse = keystone.list("MyCourse");
var cron = require('node-cron');

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
              res.json({success:true, challengeId:challenge._id});
              cron.schedule('* * * */7 * *', function(){
                console.log('running a task every 7 days');
                checkChallengeEveryWeek(challenge._id);
              });
                  
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

function checkChallengeEveryWeek(challengeId){
  var thisDayLastWeek = new Date();
  console.log(thisDayLastWeek);

  //thisDayLastWeek.setDate(thisDayLastWeek - 7);
  thisDayLastWeek.setSeconds(thisDayLastWeek.getSeconds() - 10);
  console.log(thisDayLastWeek);
  keystone.list("Challenge").model.findOne({_id: challengeId, state:"ON-GOING"}, function(err, challenge){
    if (!challenge) return;
    var firstUserId = challenge.firstUserId;
    var secondUserId = challenge.secondUserId;
    console.log(challenge);
    keystone.list("MyPost").model.findOne({userId: firstUserId, source:challenge.source, cid:challenge.cid, createdAt:{$gt:thisDayLastWeek}}
      , function(err, firstUserPost){
        keystone.list("MyPost").model.findOne({userId: secondUserId, source:challenge.source, cid:challenge.cid, createdAt:{$gt:thisDayLastWeek}}
          , function(err, secondUserPost){

            if ((firstUserPost && secondUserPost) || (!firstUserPost && !secondUserPost )) 
              return console.log("Checking a challenge: fair result.");
            
            keystone.list("User").model.find({_id: {$in: [firstUserId, secondUserId]}}, function(err,users){
              if (users.length < 2){
                return console.log("At least one of 2 users does not exist anymore")
              }
              if (users[1]._id == firstUserId){
                var temp = users[0];
                users[0] = users[1];
                users[1] = temp;
              }
              if (!firstUserPost){
                // the first user did not have any post this week
                users[0].totalPoint = Math.max(0, users[0].totalPoint - 2);
                users[1].totalPoint += 2;
              } else {
                // the second user did not have any post this week
                users[1].totalPoint = Math.max(0, users[1].totalPoint - 2);
                users[0].totalPoint += 2;
              }
              users[0].save(function(err){
                users[1].save(function(err){
                  console.log("Done checking challenge between 2 users");
                })
              })
            })
        })
    })
  })
}
