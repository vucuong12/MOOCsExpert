var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.user = req.user || null;


	locals.data = {
		currentUser : req.user || locals.defaultUser,
		//for furthur work with user, use this current user
		posts: [],
		postAuthors: [],
		friendIds: [],
	};


	//find recent post among friends
	view.on('init',function(next){
		if (locals.data.currentUser.followingPeopleIds){
			locals.data.friendIds = locals.data.currentUser.followingPeopleIds;
		}	
		console.log(locals.data.friendIds);
		next();
	});


	// Load the posts
	view.on('init', function(next) {
		var q = keystone.list('MyPost').model.find({
				userId:{$in: locals.data.friendIds}	
			})
			.sort({createdAt:'desc'})
			.limit(20);
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});

	// Load the posts author
	view.on('init', function(next) {
		async.forEachOf(locals.data.posts,function(post,index,cb){
			keystone.list('User').model.findOne({
				_id: post.userId
			}).exec(function(err,myUser){
				locals.data.postAuthors[index]=myUser;
				cb();
			});
		},function(err){
			next(err);
		});
	});

	// Render the view
	view.render('index');
	
};
