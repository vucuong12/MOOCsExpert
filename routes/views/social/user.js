var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

module.exports = {
  view: function(req, res) {	
		var view = new keystone.View(req, res);
		var locals = res.locals;
		locals.user = req.user || null;
		
		// Set locals
		locals.section = 'userpage';
		locals.data = {
			posts: [],
			postAuthors: [],
			targetUser: null,
			myCourses: [],
			courses: [],
			alreadyFollowing: false,
		};

		//get the user
		view.on('init',function(next){
			//console.log(req.params.username);
			keystone.list('User').model.findOne({
				username: req.params.username
			}).exec(function(err,res_user){
				locals.data.targetUser=res_user;
				next();
			});
		});

		//check if no user and check if friend
		view.on('init',function(next){
			if (!locals.data.targetUser)
				res.redirect('/404-no-user');
			//check if following already
			if ((locals.user.followingPeopleIds.indexOf(locals.data.targetUser._id)>-1)  || locals.user._id.equals(locals.data.targetUser._id) ){
				locals.data.alreadyFollowing=true;
			}
			next();
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

		//load all the myCourses
		view.on('init',function(next){
			keystone.list('MyCourse').model.find({
				userId:locals.data.targetUser._id
			}).limit(10).exec(function(err,list_myCourses){
				locals.data.myCourses=list_myCourses;
				async.forEachOf(locals.data.myCourses,function(myCourse,index,cb){
					keystone.list('Course').model.findOne({
						cid: myCourse.cid,
						source: myCourse.source
					}).exec(function(err,course){
						locals.data.courses[index]=course;
						cb();
					});
				},function(err){
					next(err);
				});
			});
		});


		
		// Render the view
		view.render('social/userpage');
	},

	follow: function(req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;
		var user = req.user;
		var userName = req.params.username;
		var follow = req.params.follow;
		locals.type = "userFollow";
		locals.follow = follow;
		locals.targetUser = userName;
		keystone.list("User").model.findOne({username: userName}, function(err, user){
			var userList;
			if (follow === "following"){
				userList = user.followingPeopleIds;
			} else if (follow === "followed"){
				userList = user.followedPeopleIds;
			}
			keystone.list("User").model.find({_id: {$in: userList}}, function(err, users){
				locals.users = users;
				view.render("search/searchUser");
			})
		})
	}
 
}

