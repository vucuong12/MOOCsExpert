var keystone = require('keystone');

exports = module.exports = function(req, res) {
  if (!req.user) {
    return res.redirect('/signin');
  }
  var view = new keystone.View(req, res);
  var locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'userProfile';
  
  // Render the view
  view.render('userProfile');
  
};
