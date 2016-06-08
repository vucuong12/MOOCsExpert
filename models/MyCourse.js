var keystone = require('keystone');
var Types = keystone.Field.Types;
var MyCourse = new keystone.List('MyCourse',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

MyCourse.add({
  cid: {type:Types.Text},       //the id is unique in system
  source: {type: Types.Text},   //Example: Coursera, Edx, Udemy
  userId: {type: Types.Text},
  postIds: {type: Types.TextArray},
  challengeId: {type: Types.Text}
});

MyCourse.register();