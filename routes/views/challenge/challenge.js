var keystone = require('keystone');
var async = require('async');

module.exports = {

  create: function (req, res) {
    if (!req.user){
      res.redirect("/signin");
    }
    var courseId = req.query.courseId;
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var user = req.user;
    keystone.list("Course").model.findOne({_id: courseId}, function(err, course){
      locals.course = course;
      view.render("challenge/createChallenge");
    })
  }
}
