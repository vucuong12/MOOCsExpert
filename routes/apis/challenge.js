var keystone = require('keystone');
var request = require('request');
var async = require('async');
var Notification = keystone.list("Notification");
var Challenge = keystone.list("Challenge");

module.exports = {

  inviteFriend: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;
    var friendName = req.body.friendName;
    var firstProposedTime = req.body.firstProposedTime;



    keystone.list("User").model.findOne({username: friendName}, function(err, friend){
      var challengeBody = {
        status: "PREPARING",
        firstUserId: user._id,
        secondUserId: friend._id,
        firstProposedTime: firstProposedTime,
        secondProposedTime: []
      }
      //Create new challenge
      var newChallenge = new Challenge.model(challengeBody);
      newChallenge.save(function(err, myChallenge){
        if (err) {
          return res.json({success:false});
        } else {
          //Create new notification
          keystone.list("User").model.findOne({username: friendName}, function(err, friend){
            if (err){
              res.json({success:false});
            } else {
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
                  return res.json({success:true});
                }
              })
            }
          })

          

          
        }
      })
    })

  }
}


