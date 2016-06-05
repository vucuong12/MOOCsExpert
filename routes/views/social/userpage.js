var keystone = require('keystone');
var User = keystone.list('User');
exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	locals.user = req.user || null;
	
	// Set locals
	locals.section = 'userpage';
	locals.data = {
		posts: [],
		targetUser: null,
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
	});

	//load all the posts
	view.on('init',function(next){
		keystone.list('MyPost').model.find({
			userId:locals.data.targetUser._id
		}).exec(function(err,posts_res){
			locals.data.posts=posts_res;
			next();
		});
	});
	
	
	// Render the view
	view.render('social/userpage');
	
};
