var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var type = req.params.type || null;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.user = req.user || null;


	locals.data = {
		currentUser : req.user || locals.defaultUser,
		//for furthur work with user, use this current user
		contentList: [],
		friendIds: [],
	};


	//find recent post among friends
	view.on('init',function(next){
		if (locals.data.currentUser.followingPeopleIds){
			locals.data.friendIds = locals.data.currentUser.followingPeopleIds;
		}	
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
			results = results || [];
			for (var i in results){
				results[i].type = "post";
			}
			locals.data.contentList = results || [];
			next(err);
		});
		
	});

	// Load the challenges
	view.on('init', function(next) {

		var q = keystone.list('Challenge').model.find({
				firstUserId:{$in: locals.data.friendIds},
				state:"PENDING"
			})
			.sort({createdAt:'desc'})
			.limit(20);
		
		q.exec(function(err, challenges) {
			
			challenges = challenges || [];
			//Load challenge creators
			async.each(challenges,
			function(challenge, callback){
				challenge.type = "challenge";
				keystone.list("User").model.findOne({_id: challenge.firstUserId}, function(err, user){
					challenge.creatorName = user.username;
					callback(err);
				})
			},
			function(err){
				
				locals.data.contentList = locals.data.contentList.concat(challenges);
				locals.data.contentList = locals.data.contentList.sort(function(a,b) {
			    return (a.createdAt < b.createdAt) 
			      ? 1 : (a.createdAt > b.createdAt) ? -1 : 0;
			  });
				next(err);
			})
			
		});
		
	});

	// Load the posts author
	view.on('init', function(next) {
		async.forEachOf(locals.data.contentList,function(content,index,cb){
			if (content.type === "challenge"){
				return cb();
			}
			keystone.list('User').model.findOne({
				_id: content.userId
			}).exec(function(err,myUser){
				content.postAuthor=myUser;
				cb();
			});
		},function(err){
			next(err);
		});
	});



	// Render the view
	view.render('index');
	
};
