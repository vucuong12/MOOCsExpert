var keystone = require('keystone'),
		async = require('async');

exports = module.exports = function(req, res) {
	
	if (!req.user) {
		return res.redirect('/signin');
	}

	var view = new keystone.View(req, res),
			locals = res.locals;
	
	locals.section = 'follow';

	var targetUsername = req.params.username;
	var targetUser = null;
	var action = req.params.user_action;
	keystone.list('User').model.findOne({
		username: targetUsername
	}).exec(function(err,res_user){
		targetUser=res_user;
		if (targetUser==null){
			res.json({success:false});
		} else {
			if (action=='follow')
				//follow
				if (req.user.followingPeopleIds.indexOf(targetUser._id)>-1){
					res.json({success:false});
				} else { 
					req.user.followingPeopleIds.push(targetUser._id);
					req.user.save(function(err){
						if (err) res.json({success:false});
						else res.json({success:true});
					});
					
				}
			else if (action=='unfollow') {
				//unfollow
				var pos = req.user.followingPeopleIds.indexOf(targetUser._id)
				if (pos==-1){
					res.json({success:false});
				} else {
					req.user.followingPeopleIds.splice(pos,1);
					req.user.save(function(err){
						if (err) res.json({success:false}) 
						else res.json({success:true});
					});
					
				}
			} else 
				res.json({success:false});
		}
	});

}