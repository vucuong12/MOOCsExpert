var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var MyPost = new keystone.List('MyPost',{defaultSort: '-createdAt'});

MyPost.add({
  cid: {type: Types.Text},
  source: {type: Types.Text},
  courseTitle: {type: Types.Text},
  lessonIndex: {type: Types.Number},
  lessonName: {type: Types.Text},
  content: {type: Types.Text},  
  userId: {type: Types.Text},  //_id field
  createdAt: { type: Date, default: Date.now },
  point: {type: Types.Number},
  commentIds: {type: Types.Text},     //[]
  title: {type: Types.Text}
});



/**
 * Registration
 */

MyPost.register();