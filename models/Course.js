var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Course = new keystone.List('Course',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

Course.add({
	cid: {type:Types.Text},	//the id is unique in system
	source: {type: Types.Text},		//Example: Coursera, Edx, Udemy
	slog: {type: Types.Text} ,   	//sort name of the course
	courseType: {type: Types.Text}, //session, ondemand... (only in Coursera)
	name: {type:Types.Text},
	primaryLanguages: {type:Types.Text},	//Text will be formated into JSON object "[,]"
	subtitleLanguages: {type:Types.Text},	// ["en",...]
	partnerLogo: {type:Types.Text},			//
	instructorIds: {type:Types.Text},		//[]
	partnerIds:{type:Types.Text},			//[]
	photoUrl:{type:Types.Text},
	certificates: {type:Types.Text},
	description: {type:Types.Text},
	startDate: {type:Types.Date},
	workload: {type:Types.Text},
	previewLink:{type:Types.Text},
	specializations: {type:Types.Text},
	s12nlds: {type:Types.Text}, 		//we wont use it
	domainTypes: {type:Types.Text},		//catagories tag for the course
	catagories: {type:Types.Text},		//same as domainTypes
	commentIds: {type:Types.Text},		//[]
	relatedPostIds: {type:Types.Text},	//[]
});



/**
 * Registration
 */

Course.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Course.register();