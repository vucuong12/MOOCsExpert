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
  keystone.list("User").model.findOne({_id: userId}, function(err, user){
    keystone.list("Course").model.findOne({source: source, cid: cid}, function(err, newCourse){
      addToArray(user.interestedTaxonomies, newCourse.taxonomies);
      addToArray(user.interestedTags, newCourse.tags);
      user.courseTags.push(JSON.stringify(newCourse.tags));
      user.interestedTitleTags.push(JSON.stringify(newCourse.titleTags));
      user.save(function(err){
        updateTopRelatedUsersForAllUsers(function(err){
          callback(err);
        })
        
      })
    })
  })
}

//newMyPost had to be created earlier (contains postTags)
module.exports.updateOnNewPost = function(userId, newMyPostId, callback){
  keystone.list("User").model.findOne({_id: userId}, function(err, user){
    keystone.list("MyPost").model.findOne({_id: newMyPostId}, function(err, newMyPost){
      if (!newMyPost) return callback(err);
      user.postTags = user.postTags.concat(newMyPost.postTags);
      user.save(function(err){
        updateTopRelatedUsersForAllUsers(function(err){
          console.log("Done with updateOnNewPost");
          callback(err);
        })
      })
    })
  })
}

module.exports.updateOnNewSearch = function(userId, query, callback){
  keystone.list("User").model.findOne({_id: userId}, function(err, user){
    user.searchTags.push(query);
    user.save(function(err){
      updateTopRelatedUsersForAllUsers(function(err){
          console.log("Done with updateOnNewSearch");
          callback(err);
        })
    })
  })
}

function transformToArrayOfWords(arrayOfSentences){
  var result = [];
  for (var i = 0; i < arrayOfSentences.length; i++){
    result = result.concat(arrayOfSentences[i].split(" "));
  }
  return result
}
// range [0,1], setA, setB are arrays of sentences
// eg: setA = ["I am Cuong", "picture of"]
function compareTwoSets(setA, setB){
  setA = transformToArrayOfWords(setA);
  setB = transformToArrayOfWords(setB);
  var intersectionArray = setA.filter(function(n) {
    return setB.indexOf(n) !== -1;
  });

  

  var setAminusSetB = setA.filter(function(n) {
    return setB.indexOf(n) === -1;
  });

  var intersectionArray1 = setB.filter(function(n) {
    return setA.indexOf(n) !== -1;
  });

  var setBminusSetA = setB.filter(function(n) {
    return setA.indexOf(n) === -1;
  });

  var union = ((setB.length + setAminusSetB.length) * 1.0);
  if (union == 0) return 0.0;
  var res = intersectionArray.length * 1.0 / union;
  
  return res;
}

function transformToArrayOfSentences(arrayOfCourses){
  var result = [];
  for (var i = 0; i < arrayOfCourses.length; i++){
    result = result.concat(JSON.parse(arrayOfCourses[i]));
  }
  return result;
}

function compareTwoUsers(user1, user2){
  var titleTags1 = transformToArrayOfSentences(user1.interestedTitleTags);
  var titleTags2 = transformToArrayOfSentences(user2.interestedTitleTags);
  var validField = 0;

  if (user1.interestedTags.length > 0 && user2.interestedTags.length > 0)
    validField++;
  if (titleTags1 > 0 && titleTags2 > 0)
    validField++;
  if (user1.searchTags.length > 0 && user2.searchTags.length > 0)
    validField++;
  if (user1.postTags.length > 0 && user2.postTags.length > 0)
    validField++;
  validField = 1.0 / (validField * 1.0);
  var res = 0.0;
  if (user1.interestedTags.length > 0 && user2.interestedTags.length > 0)
    res += compareTwoSets(user1.interestedTags, user2.interestedTags) * validField;
  if (titleTags1 > 0 && titleTags2 > 0)
    res += compareTwoSets(titleTags1, titleTags2) * validField;
  if (user1.searchTags.length > 0 && user2.searchTags.length > 0)
    res += compareTwoSets(user1.searchTags, user2.searchTags) * validField;
  if (user1.postTags.length > 0 && user2.postTags.length > 0)
    res += compareTwoSets(user1.postTags, user2.postTags) * validField;
  return res;
}

function updateTopRelatedUsersForAllUsers(callback){
  keystone.list("User").model.find({isAdmin:{$ne: true}}, function(err, users){
    for (var index1 in users){
      var topRelatedUsers = [];
      for (var index2 in users){
        if (index1 === index2) continue;
        topRelatedUsers.push({point:compareTwoUsers(users[index1],users[index2]), userId: users[index2]._id, username: users[index2].username});
      }

      topRelatedUsers.sort(function(a,b){
        return b.point - a.point;
      })
      users[index1].topRelatedUsers = topRelatedUsers.slice(0, 5).map(function(user){
        return JSON.stringify({id: user.userId, username: user.username});
      });

      users[index1].save(function(err){
        callback(err);
      })
    }
  })
}


