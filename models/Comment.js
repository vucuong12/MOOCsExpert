var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Comment = new keystone.List('Comment',{defaultSort: '-createdAt'});

//for all the information of type array, better if we store them in
//text, then we can retrieve them and using JSON.parse to get the array later

var Comment = new keystone.List('comment');

Comment.add({
	cid: {type: Types.Number},
	byUserId: {type: Types.Number},
	content: {type: Types.Text},
	commentType: {type: Types.Text},	//"course" for course comment
										//"social" for comment in post
	courseId: {type: Types.Text}, 		//optional
	PostId: {type: Types.Number}, 	//optional
	date: {type: Types.Date},
	point: {type: Types.Number},

});



/**
 * Registration
 */

//Comment.defaultColumns = 'film_name, film_year, film_view, film_imdb';
Comment.register();