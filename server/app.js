// ============================
// load env vars from file ====
// ============================
require('dotenv').load();

// ============================
// get the packages we need ===
// ============================
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var session = require('express-session');
var passport = require('passport');
var config = require('./config/config');
var userController = require('./controllers/user');
var itemController = require('./controllers/items');
var User = require('./models/user');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8000;
mongoose.connect(config.database);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var passportConf = require('./config/passport');
app.use(passport.initialize());

// =======================
// routes ================
// =======================

// basic route
app.get('/', function (req, res) {
	//res.send('Hello! The app is at http://localhost:' + port + '/app, and the API is at http://localhost:' + port + '/api');
	res.redirect('/app');
});

// CLIENT ROUTES ----------------

app.use('/app', express.static(path.join(__dirname, '../www')));

// Creation & authentication of users
app.route('/user')
	.post(userController.postUser)
	.get(userController.getUsers);

app.post('/user/authenticate', userController.authenticateUser);

// SOCIAL AUTH ROUTES -----------

// we require sessions for these, so that we may store any JWTs
// attached to the request
app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: false
}));

app.get('/auth/result', function (req, res) {
	res.send('<html><head><title>Social Auth Result</title></head></html>');
});

app.get('/auth/google', function (req, res, next) {
	// if we were authorised at the time of the request, make a note of the token
	// for the passport strategy to access after the callback
	var token = req.query.token ? User.decodeToken(req.query.token) : null;
	if (token) {
		req.session.jwt = req.query.token;
	}
	req.session.returnTo = req.query.returnTo;
	next();
}, passport.authenticate('google', { scope: 'profile email', session: false }));

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), function (req, res) {
	// check for error flag
	if (req.user.error) {
		res.redirect('/auth/result?error=' + req.user.error);
	} else {
		if (req.session.returnTo) {
			res.redirect(req.session.returnTo + '?token=' + req.user.generateToken());
		} else {
			res.redirect('/auth/result?token=' + req.user.generateToken());
		}
		req.session.destroy();
	}
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
	console.log('FACEBOOK AUTHED');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github'), function (req, res) {
	console.log('GITHUB AUTHED');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
	console.log('TWITTER AUTHED');
});

// API ROUTES -------------------

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({
	secret: config.secret,
	isRevoked: userController.isRevokedToken/*,
	issuer: config.jwtIssuer,
	audience: config.jwtAudience*/
}));

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.get('/', function (req, res) {
	res.json({ message: 'Welcome to the Lye Brary Anne API.' });
});

apiRoutes.route('/items')
	.get(itemController.getItems)
	.post(itemController.createItem);

apiRoutes.route('/items/:id')
	.get(itemController.getItem)
	.put(itemController.updateItem)
	.delete(itemController.deleteItem);

apiRoutes.get('/systems', itemController.getSystems);

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// 404 ===================
// =======================

app.use(function (req, res, next) {
	res.status(404).json({ message: 'File not found.' });
});

// =======================
// error handling ========
// =======================

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({ message: 'Invalid or missing authorisation token.' });
	} else {
		console.log(err);
		res.status(500).json({ message: 'Unknown server error.' });
	}
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server running at http://localhost:' + port);
