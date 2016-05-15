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
	cid: {type: Types.Number},
	content: {type: Types.Text},
	byUserId: {type: Types.Number},
	openDate: {type: Types.Date},
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