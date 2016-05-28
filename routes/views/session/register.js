var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	
	// Set locals
	locals.section = 'register';
	view.on('post', {}, function(next) {
		async.series(
			[function(cb){
				if (!req.body.email || !req.body.password || !req.body.username || !req.body.password_confirm) {
					req.flash('error', 'Please enter your information correctly.');
					return cb(true);
				}

				if (!(req.body.password==req.body.password_confirm)) {
					req.flash('error', 'Mismatch password confirm');
					return cb(true);
				}

				User.model.findOne({email:req.body.email},function(err,user){
					if (err || user) {
						req.flash('error', 'User already exists with the email');
						return cb(true);
					}
					return cb();
				});		
			},

			function(cb){
				var userData = {
					email: req.body.email,
					password: req.body.password,
					username: req.body.username
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);
				
				newUser.save(function(err) {
					req.flash('error', 'Opps, something bad happened, pls register again');
					return cb(err);
				});
			}],
			function(err){

				if (err){
					console.log(err);
					return next();	

				} 

				var onSuccess = function() {
					res.redirect("/");
				}
				
				var onFail = function() {
					req.flash('error', 'Registered, but there is a problem with sign in, please try again');
					return next();
				}
				
				keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			}
			
		);
	});
	
	// Render the view
	view.render('session/register');
	
};