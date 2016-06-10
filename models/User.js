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
	cid: {type:Types.Text},
	name: { type: Types.Name, required: true, index: true },
	//need some personal information
	age: {type:Types.Number},
	email: { type: Types.Email, initial: true, required: true, index: true, unique:true },
	password: { type: Types.Password, initial: true, required: true },	// hashed value of password using bscrypt
	enrolledCourseIds: {type:Types.TextArray},	//universal ID of course that he/she are enrolling
											//for example ["CourseraCS101","EdxMSS11"]
	finishedCourseIds:{type:Types.TextArray},		//universal ID of course that user finished
	commentIds: {type:Types.TextArray},
	PostIds: {type:Types.Text},
	socialPoint: {type:Types.Number},
	followingPeopleIds: {type:Types.TextArray},  //[]  people that this user are following
	followedPeopleIds: {type:Types.TextArray},	//[]  people that follow this user
	enrollingChallengeIds: {type:Types.TextArray},	//[]
	finishedChallengeIds: {type:Types.TextArray},	//[]
	location: {type:Types.Text},				//name of area		
	language: {type:Types.Text},
	currentUniversity: {type:Types.Text},
	myCourses: {type: Types.TextArray},
	myPosts: {type: Types.TextArray},
	myChallenges: {type: Types.TextArray},
	profilePicture: {type: Types.Text, default:"http://www.twiisty.com/Uploads/Profile/default_profile_pic.png"},
	recommendedCourses: {type: Types.TextArray},
	recommendedPosts: {type: Types.TextArray},
	interestedTaxonomies: {type: Types.TextArray},
	interestedTags: {type: Types.TextArray},
	interestedTitleTags: {type: Types.TextArray, default: []},
	courseTags: {type: Types.TextArray},
	postTags: {type: Types.TextArray},
	searchTags: {type: Types.TextArray},
	totalPoint: {type: Types.Number, default: 0},
	topRelatedUsers: {type: Types.TextArray},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});



/**
 * Registration
 */

User.defaultColumns = 'username, name, _id';
User.register();


// Y.add({
// 	name: { type: Types.Name, required: true, index: true },
// 	email: { type: Types.Email, initial: true, required: true, index: true },
// 	password: { type: Types.Password, initial: true, required: true }
// }, 'Permissions', {
// 	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
// });

// // Provide access to Keystone



// /**
//  * Relationships
//  */

// //Y.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


// /**
//  * Registration
//  */

// Y.defaultColumns = 'name, email, isAdmin';
// Y.register();

