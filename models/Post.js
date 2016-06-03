var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Post = new keystone.List('Post');

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later


Post.add({
	cid: {type: Types.Number, require:true},
	content: {type: Types.Textarea},
	byUserId: {type: Types.Text},
	date: {type: Types.Date},
	point: {type: Types.Number},
	commentIds: {type: Types.Text},			//[]
	relatedCourseId: {type: Types.Text},	//1 course related only for 1 post
	relatedCourseLession: {type: Types.Text},
});



/**
 * Registration
 */

//Post.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Post.register();