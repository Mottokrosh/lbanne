// Load required packages
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var uuid = require('uuid');

// Create endpoint /api/users for POST
exports.postUser = function (req, res) {
	var user = new User({
		email: req.body.email,
		password: req.body.password
	});

	user.save(function (err) {
		if (err) res.send(err);

		res.json({ message: 'New user added' }); // consider returning user object instead
	});
};

// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
	/*User.find(function (err, users) {
		if (err) res.send(err);

		res.json(users);
	});*/
};

exports.authenticateUser = function (req, res) {
	if (!req.body.email || !req.body.password) {
		res.status(401).json({ success: false, message: 'Authentication failed. Missing email or password.' });
	} else {
		// find the user
		User.findOne({
			email: req.body.email
		}, function (err, user) {
			if (err) throw err;

			if (!user) {
				res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });

			} else if (user) {
				// check if password matches
				 user.verifyPassword(req.body.password, function (err, isMatch) {
					if (err) throw err;

					// Password did not match
					if (!isMatch) {
						res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
					} else {
						// if user is found and password is right
						// create a token
						var token = user.generateToken();

						// return the information including token as JSON
						res.json({
							success: true,
							message: 'Authentication token attached.',
							token: token
						});
					}
				});
			}
		});
	}
};

exports.isRevokedToken = function(req, payload, done){
	var issuer = payload.iss;
	var tokenId = payload.jti;

	// see if token is in list of revoked tokens, then return true (revoked) or false (not revoked)
	return done(null, false);
};