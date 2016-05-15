var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Partner = new keystone.List('Partner',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

Partner.add({
	cid: {type: Types.Text},  	//partner ID
	name: {type:Types.Text},
	shortName: {type:Types.Text},
	description: {type:Types.Text},
	banner: {type:Types.Text}, 	//url
	courseIds: {type:Types.Text},	//[]
	instructorIds: {type:Types.Text}, //[]
	primaryColor: {type:Types.Text}, 
	logo: {type:Types.Text},
	squareLogo: {type:Types.Text},
	rectangularLogo: {type:Types.Text},
	links: {type:Types.Text},	//[]
	location: {type:Types.Text},	
});



/**
 * Registration
 */

Partner.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Partner.register();