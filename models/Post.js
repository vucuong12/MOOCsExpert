var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Post = new keystone.List('Post',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later


Post.add({
	cid: {type: Types.Number},
	content: {type: Types.Text},
	byUserId: {type: Types.Number},
	date: {type: Types.Date},
	point: {type: Types.Number},
	commentIds: {type: Types.Text},			//[]
	relatedCourseId: {type: Types.Text},	//1 course related only for 1 post
});



/**
 * Registration
 */

//Post.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Post.register();