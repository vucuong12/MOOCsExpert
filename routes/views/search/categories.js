var keystone = require('keystone');
var async = require('async');
var PAGE_SIZE = 20;

module.exports = {

  view: function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var page = req.query.page || 0;
    var category = req.query.category;
    var source = req.query.source;
    keystone.list("Course").model.find({source: source,category: category})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .exec(function(err, courses){
      locals.results = courses;
      locals.type = "categorySearch";
      locals.category = category;
      locals.page = page;
      locals.source = source;
      view.render("search/search")
    })
    
  }
}
