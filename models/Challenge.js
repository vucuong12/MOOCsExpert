var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Challenge = new keystone.List('Challenge',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

Challenge.add({
	state: {type: Types.Text},
  cid: {type: Types.Text},
  source: {type: Types.Text},
  firstUserId: {type: Types.Text},
  secondUserId: {type: Types.Text},

  firstProposedTime: {type: Types.TextArray}, //of the first user
  secondProposedTime: {type: Types.TextArray}, //of the second user

  duration: {type: Types.Number}, //weeks
	createdAt: { type: Date, default: Date.now },
	expireDate:{type: Types.Date},
	





  point: {type: Types.Number},
	commentIds: {type: Types.Number},	//[]
	relatedCourseId: {type: Types.Text},
	EnrollingUserIds: {type: Types.Text},  //[]

});



/**
 * Registration
 */

Challenge.defaultColumns = 'id';
Challenge.register();