var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var User = new keystone.List('User',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

var User = new keystone.List('User');

User.add({
	username: {type: Types.Text, required: true, default:"noname", index:true},
	cid: {type:Types.Number},
	name: { type: Types.Name, required: true, index: true },
	//need some personal information
	age: {type:Types.Number},
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },	// hashed value of password using bscrypt
	enrolledCourseIds: {type:Types.Text},	//universal ID of course that he/she are enrolling
											//for example ["CourseraCS101","EdxMSS11"]
	finishedCourseIds:{type:Types.Text},		//universal ID of course that user finished
	commentIds: {type:Types.Text},
	PostIds: {type:Types.Text},
	socialPoint: {type:Types.Number},
	followingPeopleIds: {type:Types.Text},  //[]  people that this user are following
	followedPeopleIds: {type:Types.Text},	//[]  people that follow this user
	enrollingChallengeIds: {type:Types.Text},	//[]
	finishedChallengeIds: {type:Types.Text},	//[]
	location: {type:Types.Text},				//name of area		
	language: {type:Types.Text},
	currentUniversity: {type:Types.Text} 

}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});



/**
 * Registration
 */

User.defaultColumns = 'username, name';
User.register();