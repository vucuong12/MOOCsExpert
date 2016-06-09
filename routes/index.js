/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	apis: importRoutes('./apis')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/index/:type', routes.views.index);
	app.get('/postCreate', routes.views.postCreate);
	
	app.all('/signin',routes.views.session.signin);
	app.all('/register',routes.views.session.register);
	app.get('/signout',routes.views.session.signout);
	app.post('/signinas',routes.views.session.signinas);
	
	app.post('/quickSearch', routes.apis.search.quickSearch);
	app.get('/course', routes.views.course);
	app.post('/update/takecourse', routes.apis.update.takeCourse);
	
	//user custom page
	app.get('/userProfile', routes.views.userProfile);
	app.get('/myPage', routes.views.myPage);


	//social
	app.post('/post/create', routes.apis.post.create);
	app.get('/post', routes.views.social.post.view);
	app.get('/user/:username/action/:user_action',routes.apis.follow);  //follow unfollow
	app.get('/user/:username', routes.views.social.user.view);  //view other user page/profile
	app.get('/user/:username/:follow',routes.views.social.user.follow); 
	app.post('/categories/get', routes.apis.categories.get);
	app.get('/search/categories', routes.views.search.categories.view);
	app.get('/search', routes.views.search.search);
	app.get('/updatepoint/:postid/:action',routes.apis.point);


	//challenge
	app.get('/challenge/view', routes.views.challenge.challenge.view);
	app.get('/challenge/create', routes.views.challenge.challenge.create);
	app.post('/challenge/inviteFriend', routes.apis.challenge.inviteFriend);
	app.post('/challenge/updateOption', routes.apis.challenge.updateOption);
	app.post('/challenge/updateAgree', routes.apis.challenge.updateAgree);
	app.post('/challenge/updateRefuse', routes.apis.challenge.updateRefuse);
	app.post('/challenge/sendProposedTime', routes.apis.challenge.sendProposedTime);
	//notification
	app.post("/notification/get", routes.apis.notification.getNoti);
	app.post("/notification/viewedAll", routes.apis.notification.viewedAll);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
