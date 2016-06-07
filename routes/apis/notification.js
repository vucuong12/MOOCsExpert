var keystone = require('keystone');
var request = require('request');
var async = require('async');
var Notification = keystone.list("Notification");

module.exports = {

  getNoti: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;

    keystone.list("Notification").model.find({userId: user._id}, function(err, notis){
      console.log("DM");
      console.error(err);
      if (err) {

        res.json({success: false});
      } else {
        res.json({success:true, notis: notis})
      }
    })

  },

  viewedAll: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var locals = res.locals;
    var user = req.user;

    keystone.list("Notification").model.update({userId: user._id},{isViewed: true}, {multi: true}, function(err, notis){
      if (err) {
        res.json({success: false});
      } else {
        res.json({success:true, notis: notis})
      }
    })

  }
}


