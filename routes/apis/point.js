var keystone = require('keystone'),
		async = require('async');

exports = module.exports = function(req, res) {
	
	if (!req.user) {
		return res.redirect('/signin');
	}

	var view = new keystone.View(req, res),
			locals = res.locals;
	var userid = req.query.userid;
	var type;
	locals.section = 'point';
	locals.data = {
		postid : req.params.postid,
		action : req.params.action
	}

	keystone.list('MyPost').model.findOne({
		_id:locals.data.postid	
	}).exec(function(err,post){
		if (post) {
			keystone.list('User').model.findOne({_id:post.userId})
			.exec(function(err,user){
				if (!user) return res.json({success:false});
				// First case: un-upvote, un-downvote
				var pos1, pos2;
				pos1 = post.upvoteUserIds.indexOf(req.user._id);
				pos2 = post.downvoteUserIds.indexOf(req.user._id);
				if ((locals.data.action == "upvote" && post.upvoteUserIds && (pos1 !== -1))
				|| (locals.data.action == "downvote" && post.downvoteUserIds && (pos2 !== -1))){
					if (locals.data.action == "upvote") {
						user.totalPoint--;
						post.point--;
						post.upvoteUserIds.splice(pos1,1);
					} else {
						user.totalPoint++;
						post.point++;
						post.downvoteUserIds.splice(pos2,1);
					}
					type = 0;
				} else {
					//Case 2: real upvote/downvote
					if (locals.data.action == "upvote"){
						user.totalPoint++;
						post.point++;
						type = 1;
						console.log(pos1 + " " + pos2);
						if (pos2 !== -1){
							//if this user downvoted before, it becomes neutral
							post.downvoteUserIds.splice(pos2,1);
							type = 0;
						} else
							post.upvoteUserIds.push(req.user._id);
						
					} else {
						user.totalPoint--;
						post.point--;
						type = -1;
						if (pos1 !== -1){
							//if this user upvote before, we need to subtract more points
							post.upvoteUserIds.splice(pos1,1);
							type = 0;
						} else
							post.downvoteUserIds.push(req.user._id);
						
					}
					
				}

				
				user.save(function(err){
					post.save(function(err){
						if (err) {
							res.json({success:false});
						} else {
							res.json({success:true, point:post.point, type:type});
						}
					})
				});
			});
		} else {
			res.json({success:false});
		}
	});


}