var keystone = require('keystone');
var async = require('async');

module.exports = {

  view: function (req, res) {
    if (!req.user){
      res.redirect("/signin")
    }
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var user = req.user;
    var challengeId = req.query.id;
    //work fast to keep pace with the deadline->no error check
    keystone.list("Challenge").model.findOne({_id: challengeId, state: {$ne: "REMOVED"}}, function(err, challenge){
      if (!challenge){
        return res.send("Challenge does not exist");
      }
      keystone.list("Course").model.findOne({cid: challenge.cid, source: challenge.source}, function(err, course){
        keystone.list("User").model.find({_id:{$in: [challenge.firstUserId, challenge.secondUserId]}}, function(err, users){
          if (users[0]._id == challenge.firstUserId){
            locals.user1 = users[0];
            locals.user2 = users[1];
          } else {
            locals.user1 = users[1];
            locals.user2 = users[0];
          }
          locals.course = course;
          locals.challenge = challenge;
          view.render("challenge/viewChallenge")
        })  
      })
    })
  },

  create: function (req, res) {
    if (!req.user){
      res.redirect("/signin");
    }
    var source = req.query.source;
    var cid = req.query.id;
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var user = req.user;
    keystone.list("Course").model.findOne({cid:cid,source:source}, function(err, course){
      locals.course = course;
      view.render("challenge/createChallenge");
    })
  }
}
