var keystone = require("keystone");
var async = require("async");
var mongoose = require('mongoose');
var mongodbAdd = /*"52.39.232.71" || */"127.0.0.1";
mongoose.connect('mongodb://' + mongodbAdd + ':27017/moocsexpert');
/*var Course = require('../crawlers/models/Course');
var User = require('../crawlers/models/User');*/
//var Post = require('../crawlers/models/Post');
var Course = keystone.list("Course");
var User = keystone.list("User");

function addToArray(array1, array2){
  for (var i = 0; i < array2.length; i++){
    if (array1.indexOf(array2[i]) === -1){
      array1.push(array2[i]);
    }
  }
}



module.exports.updateOnNewCourse = function(userId, source, cid, callback){
  console.log(userId);
  keystone.list("User").model.findOne({_id: userId}, function(err, user){

    keystone.list("Course").model.findOne({source: source, cid: cid}, function(err, newCourse){
      addToArray(user.interestedTaxonomies, newCourse.taxonomies);
      addToArray(user.interestedTags, newCourse.tags);
      user.courseTags.push(JSON.stringify(newCourse.tags));
      user.interestedTitleTags.push(JSON.stringify(newCourse.titleTags));

      console.log(newCourse.titleTags);
      user.save(function(err){
        callback(err);
        /*keystone.list("Course").model.aggregate(
            [ 
                { "$match": { "tags.1": { "$exists": true } } }, 
                { "$redact": { 
                    "$cond": [ 
                        { "$gte": [ 
                            { "$size": { "$setIntersection": [ "$tags", user.interestedTags ] } }, 
                            2
                        ]},
                        "$$KEEP", 
                        "$$PRUNE" 
                    ]
                }}
            ]
        ).exec(function(err, courses){
          console.log("Finish for updating tags ");
          console.log(courses.length);
          console.log(newCourse.tags);
          
        })*/
        
      })
      
    })
  })
}

module.exports.updateOnNewPost = function(maxPage, callback){
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Opened mongoose at mongodbAdd " + mongodbAdd);
    run();
  });
}

module.exports.updateOnNewSearch = function(maxPage, callback){
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("Opened mongoose at mongodbAdd " + mongodbAdd);
    run();
  });
}