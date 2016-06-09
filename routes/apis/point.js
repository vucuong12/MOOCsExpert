var keystone = require('keystone'),
		async = require('async');

exports = module.exports = function(req, res) {
	
	if (!req.user) {
		return res.redirect('/signin');
	}

	var view = new keystone.View(req, res),
			locals = res.locals;
	
	locals.section = 'point';
	locals.data = {
		postid : req.params.postid,
		action : req.params.action
	}

	keystone.list('MyPost').model.findOne({
		_id:locals.data.postid	
	}).exec(function(err,post){
		if (post) {
			if (post.userId) {
				keystone.list('User').model.findOne({_id:post.userId})
				.exec(function(err,user){
					if (locals.data.action=='upvote') user.totalPoint++;
					if (locals.data.action=='downvote') user.totalPoint--;
					user.save(function(err){});
				});
			}
			if (locals.data.action=='upvote') post.point++;
			if (locals.data.action=='downvote') post.point--;
			post.save(function(err){
				if (err) {
					res.json({success:fail});
				} else {
					res.json({success:true, point:post.point});
				}
			});
		} else {
			res.json({success:fail});
		}
	});


}