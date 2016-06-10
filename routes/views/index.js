var keystone = require('keystone');
var User = keystone.list('User');
var async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var type = req.params.type || "none";
	var user = req.user;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.user = req.user || null;


	locals.data = {
		currentUser : req.user || locals.defaultUser,
		//for furthur work with user, use this current user
		contentList: [],
		friendIds: [],
		mostReputedUsers: []
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
    if (user) console.log(1); 
    else console.log(2);
    if (user && (type === "none" || type === "friends")){
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
    } else if (!user) {
      console.log("Hahaha");
      keystone.list("MyPost").model.find({})
      .sort({createdAt:'desc'})
      .limit(20).exec(function(err, results){
        results = results || [];
        for (var i in results){
          results[i].type = "post";
        }
        locals.data.contentList = results || [];
        next(err);
      });
    } else {
      return next();
    }
		
	});

  //Load related posts
  view.on('init', function(next) {
    if (!user || type !== "discover") return next();
    var numTags = 1;
    var firstMatch = {};
    if (numTags > 0)
      firstMatch["tags."+Math.min(numTags-1, 2)] = { "$exists": true }
    else return next();
    keystone.list("MyPost").model.aggregate(
      [ 
        { "$match":  firstMatch},
        //{ "$match": {"source":{$ne:"Coursera"}}}, 
        { "$redact": { 
          "$cond": [ 
            { "$gte": [ 
                { "$size": { "$setIntersection": [ "$tags", user.interestedTags ] } }, 
                numTags
            ]},
            "$$KEEP", 
            "$$PRUNE" 
          ]
        }}
      ]
    ).exec(function(err, myPosts){
      if (!myPosts) return next();
      console.log("relatedPost " + myPosts.length);
      if (myPosts.length > 0){
        myPosts.sort(function(a,b){
          return findSimilarPoint(b.tags, user.interestedTags)
          - findSimilarPoint(a.tags, user.interestedTags);
        })
        
        myPosts = myPosts || [];
        for (var i in myPosts){
          myPosts[i].type = "post";
        }
        //console.log(myPosts[0]._.createdAt.format('MMMM Do, YYYY'));
        locals.data.contentList = myPosts || [];
        next(err);
      } else {
        keystone.list("MyPost").model.find({})
          .sort({createdAt:'desc'})
          .limit(20).exec(function(err, results){
            results = results || [];
            for (var i in results){
              results[i].type = "post";
            }
            locals.data.contentList = results || [];
            next(err);
          });
      }
      
      
    })
  });

	// Load the challenges
	view.on('init', function(next) {
    var query = {state:"PENDING", secondUserId: null};
    if (user && type !== "discover") query.firstUserId = {$in: locals.data.friendIds};
		var q = keystone.list('Challenge').model.find(query)
			.sort({createdAt:'desc'})
			.limit(20);
		
		q.exec(function(err, challenges) {
			console.log(type + JSON.stringify(query) + " " + challenges.length);
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


	// Load the course recommendation for this user
	view.on("init", function(next){
		if (!user || user.courseTags.length === 0) return next();
		//Choose a random course (represented by its index) taken by this user
		var randomCourseIndex;
		var numTags;
		randomCourseIndex = Math.floor(Math.random()*user.courseTags.length);
		//Other course must have at least numTags tags similar to this course
		var randomCourseTags = JSON.parse(user.courseTags[randomCourseIndex])
		numTags = Math.min(1, randomCourseTags.length);
		 
		var firstMatch = {};
		if (numTags > 0)
			firstMatch["tags."+Math.min(numTags-1, 2)] = { "$exists": true }
		else return next();
		
		keystone.list("Course").model.aggregate(
        [ 
            { "$match":  firstMatch},
            { "$match": {"source":{$ne:"Coursera"}}}, 
            { "$redact": { 
                "$cond": [ 
                    { "$gte": [ 
                        { "$size": { "$setIntersection": [ "$tags", randomCourseTags ] } }, 
                        numTags
                    ]},
                    "$$KEEP", 
                    "$$PRUNE" 
                ]
            }}
        ]
    ).exec(function(err, recommendedCourses){
    	if (!recommendedCourses) return next();
    	if (user.interestedTitleTags.length > 0){
    		var randomCourseTitleTags = JSON.parse(user.interestedTitleTags[randomCourseIndex]);

		  	recommendedCourses.sort(function(a,b){
          a.titleTags = a.titleTags || [];
          b.titleTags = b.titleTags || [];
		  		return (findSimilarPoint(randomCourseTitleTags,b.titleTags) 
		  			    - findSimilarPoint(randomCourseTitleTags,a.titleTags))
		  	})
    	}
	  	
    	//shuffle(recommendedCourses);
    	locals.recommendedCourses = recommendedCourses.slice(0,10);
      next(err);
    })
	})
  //Load related users
  view.on('init', function(next) {
    if (!user) return next();
    locals.relatedUsers = user.topRelatedUsers || [];
    for (var i = 0; i < locals.relatedUsers.length; i++){
      locals.relatedUsers[i] = JSON.parse(locals.relatedUsers[i]);
    }
    return next();
  });



	//load the users with most point on their profile: mostReputedUsers

	view.on('init', function(next) {
		keystone.list('User').model.find({}).sort({totalPoint:'desc'}).limit(6)
		.exec(function(err,users){
			locals.data.mostReputedUsers=users;
			next();
		})
	});



	// Render the view
	view.render('index');
	
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function transformToArrayOfWords(titleTags){
	var result = [];
	for (var i = 0; i < titleTags.length; i++){
		result = result.concat(titleTags[i].split(" "));
	}
	return result
}

function findSimilarPoint(sampleTitleTags, targetTitleTags){
	var tagArray1 = transformToArrayOfWords(sampleTitleTags);
	var tagArray2 = transformToArrayOfWords(targetTitleTags);
	var intersectionArray = tagArray1.filter(function(n) {
    return tagArray2.indexOf(n) != -1;
	});
	return intersectionArray.length;
}

function findSimilarPointArray(titleTagsArray, targetTitleTags){
	var result = 0;
	for (var i in titleTagsArray){
		result = Math.max(result, findSimilarPoint(titleTagsArray[i], targetTitleTags));
	}
	return result;
}
