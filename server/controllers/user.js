// Load required packages
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var uuid = require('uuid');
var postmark = require('postmark')(process.env.POSTMARK_API_TOKEN);
var crypto = require('crypto');

var sha1sum = function (input) {
	return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
};

// POST /user
exports.postUser = function (req, res) {
	var user = new User({
		email: req.body.email,
		password: req.body.password,
		verificationToken: sha1sum(uuid())
	});

	var verifLink = [req.protocol, '://', req.hostname, config.port === 8000 ? ':' + 8000 : '', '/user/verify/', user.verificationToken].join('');

	user.save(function (err) {
		if (err) {
			if (err.code === 11000) {
				return res.status(409).json({ success: false, message: 'This email address already has an account.' });
			} else {
				return res.status(500).json(err);
			}
		}

		// send email
		postmark.send({
			'From': config.mailSender.email,
			'To': user.email,
			'Subject': 'Welcome to Lye Brary Anne',
			'TextBody': 'Hello,\n\nThank you for creating an account with Lye Brary Anne. We hope you find the service useful.\n\nAs an extra security precaution, we ask that you please confirm your email address by clicking on the link below.\n\n{{link}}\n\nFrank.'.replace('{{link}}', verifLink),
			'Tag': 'accountCreation'
		}, function (error, success) {
			if (error) {
				console.error('Unable to send via postmark: ' + error.message);
				return;
			}
			console.info('Sent to postmark for delivery');
		});

		res.status(201).json({
			success: true,
			message: 'New user created.',
			token: user.generateToken()
		});
	});
};

// GET /user
exports.getUsers = function (req, res) {
	res.send(403).json();
};

// POST /user/authenticate
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

// GET /user/verify/:token
exports.verifyUserEmail = function (req, res) {
	if (!req.params.token) {
		return res.status(404).send('File not found.');
	}

	User.findOneAndUpdate(
		{ verificationToken: req.params.token },
		{ verified: true, verificationToken: null },
		{ new: true },
		function (err, user) {
			if (err) return res.status(500).json({ message: 'A server error has occurred. '});
			if (!user) return res.status(404).send('File not found.');
			res.redirect(config.appPath + '/#/msg/verified');
		}
	);
};

exports.isRevokedToken = function(req, payload, done){
	var issuer = payload.iss;
	var tokenId = payload.jti;

	// see if token is in list of revoked tokens, then return true (revoked) or false (not revoked)
	return done(null, false);
};
