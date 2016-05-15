var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Instructor = new keystone.List('Instructor',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

Instructor.add({
	cid: {type: Types.Number},
	photo: {type:Types.Text}, 	//Url of photo
	photo150: {type:Types.Text},	//150x150 photo 
	bio: {type:Types.Text},
	prefixName: {type:Types.Text},
	firstName: {type:Types.Text},
	middleName: {type:Types.Text},
	lastName: {type:Types.Text},
	suffixName: {type:Types.Text},
	fullName: {type:Types.Text},
	title: {type:Types.Text},
	department: {type:Types.Text},
	website: {type:Types.Text},
	websiteTwitter: {type:Types.Text},
	websiteFacebook: {type:Types.Text},
	websiteLinkedin: {type:Types.Text},
	websiteGplus: {type:Types.Text},
	shortName: {type:Types.Text},
	universities: {type:Types.Text},		//[]
	courses: 	{type:Types.Text},			//[]
	sessions: {type:Types.Text},			//[]
});



/**
 * Registration
 */

Instructor.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Instructor.register();