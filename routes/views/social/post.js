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
    locals.user = req.user;

    view.on("init", function(next){
    	async.waterfall([
	      //create a new post instance from Post model
	      function(callback){
	        keystone.list("MyPost").model.findOne({_id: postId}).exec(function(err, myPost){
	        	if (err){
	        		console.error(err);
	        	}
	        	locals.myPost = myPost;
	        	callback(err, myPost);
	        })

	      }
	    ],
	    function(err){
	      next();
	    })
    })

    
    view.render("post");
  }
}