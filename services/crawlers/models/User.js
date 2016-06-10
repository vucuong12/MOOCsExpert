var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userScheme = new Schema({
  username: {type:String},
  myCourses: [],
  myPosts: [],
  myChallenges: [],
  recommendedCourses: [],
  recommendedPosts: [],
  interestedTaxonomies: [],
  interestedTags: [],
  interestedTitleTags: [],
  courseTags: []
});
var User = mongoose.model('Course',userScheme);

module.exports = User;