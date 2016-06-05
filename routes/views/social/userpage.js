var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');
exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.user = req.user || null;
	
	// Set locals
	locals.section = 'userpage';
	locals.data = {
		posts: [],
		postAuthors: [],
		targetUser: null,
		courses: [],
		
	};

	//get the user
	view.on('init',function(next){
		keystone.list('User').model.findOne({
			username: req.params.username
		}).exec(function(err,res_user){
			locals.data.targetUser=res_user;
			next();
		});
	});

	//check if no user
	view.on('init',function(next){
		if (!locals.data.targetUser)
			res.redirect('/404-no-user');
		else next();
	});

	//load all the posts
	view.on('init',function(next){
		keystone.list('MyPost').model.find({
			userId:locals.data.targetUser._id
		}).exec(function(err,posts_res){
			locals.data.posts=(posts_res || []);
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
	});

	//load all the courses
	view.on('init',function(next){
		keystone.list('MyCourse').model.find({
			userId:locals.data.targetUser._id
		}).limit(10).exec(function(err,list_courses){
			locals.data.courses=list_courses;
			next();
		});
	});

	
	
	// Render the view
	view.render('social/userpage');
	
};
