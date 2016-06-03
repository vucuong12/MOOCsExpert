var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'newfeeds';

	locals.data = {
		posts: [],
		friendIds: [],
	};
	
	//find recent post among friends
	view.on('init',function(next){
		if (req.user.followingPeopleIds){
			locals.data.friendIds = JSON.parse(req.user.followingPeopleIds);
		}	
		console.log(locals.data.friendIds);
		next();
	});

	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.find({
				byUserId:{$in: locals.data.friendIds}	
			});
			// .sort('-date')
			// .find().skip((req.query.page-1 || 1)*10).limit(10);
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('newfeeds');
	
};
