var keystone = require('keystone');
var request = require('request');
var async = require('async');


module.exports = {

  view: function (req, res) {
    if (!req.user){
      return res.redirect("/signin");
    }
    var view = new keystone.View(req, res);
    var locals = res.locals;
    var user = req.user;
    var postId = req.query.postId;

    view.on("init", function(next){
    	async.waterfall([
	      //create a new post instance from Post model
	      function(callback){
	        keystone.list("MyPost").model.findOne({_id: postId}).lean().exec(function(err, myPost){
	        	if (err){
	        		console.error(err);
	        	}
	        	locals.myPost = myPost;
	        	console.log(locals.myPost);
	        	callback(err, myPost);
	        })

	      },
	      //update postIds in user
	      function(myPostId, callback){
	        keystone.list("User").model.findOne({_id: user._id}, function(err, user){
	          callback(err);
	        });
	        
	      }
	    ],
	    function(err){
	      next();
	    })
    })

    
    view.render("post");
  }
}