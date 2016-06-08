var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	
	// Set locals
	locals.section = 'signin as';

	console.log(req.body.email);
	console.log(req.body.password);
	console.log(req.body.username);


	if (!req.body.email || !req.body.password || !req.body.username ) {
		console.log("wrong input");
		return res.json({success:false});
	}

	var onSuccess = function() {
		res.json({success:true});
	}				
	var onFail = function() {
		console.log("cant sign in");
		res.json({success:false});
	}


	User.model.findOne({username:req.body.username},function(err,user){
		//register
		if (!user) {
			var userData = {
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				cid: req.body.username,
				profilePicture: req.body.profilePicture
			};
			var User = keystone.list('User').model,
			newUser = new User(userData);
			newUser.save(function(err) {
				if (err) {
					console.log("cant set new user");
					res.json({success:false});
				} else {
					keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
				}
			});			
		} else {
			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
		}
	});		
	
};