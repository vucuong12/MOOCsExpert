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
	cid: {type:Types.Text},	      //the id is unique in system
	source: {type: Types.Text},		//Example: Coursera, Edx, Udemy
	title: {type: Types.Text} ,   	//short name of the course
	url: {type: Types.Text},
	smallImageUrl: {type: Types.Text},
	bigImageUrl : {type: Types.Text},
	language: {type:Types.Text},	//Text will be formated into JSON object "[,]"
	description: {type: Types.Text},
	instructors: {type: Types.Text}, //[]
	lessons: {type: Types.Text},
	duration: {type: Types.Text},
	isPaid: {type: Types.Boolean},
	price: {type: Types.Text},
	courseraType: {type: Types.Text},
	category: {type: Types.TextArray},
	taxonomies: {type: Types.TextArray},
	tags: {type: Types.TextArray}
});
/*
Course.schema.add({
	test: [{

	}]
})*/



/**
 * Registration
 */

//Course.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Course.register();