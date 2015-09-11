// Load required packages
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var uuid = require('uuid');
var postmark = require('postmark')(process.env.POSTMARK_API_TOKEN);
var crypto = require('crypto');
var generatePassword = require('password-generator');

var sha1sum = function (input) {
	return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex');
};

var createlink = function (req, path) {
	return req.protocol + '://' + req.hostname + (config.port === 8000 ? ':' + 8000 : '') + path;
};

// POST /user
exports.postUser = function (req, res) {
	var user = new User({
		email: req.body.email,
		password: req.body.password,
		verificationToken: sha1sum(uuid())
	});

	var verifLink = createlink(req, '/user/verify/' + user.verificationToken);

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

// POST /user/reset
exports.resetPassword = function (req, res) {
	if (!req.body.email) {
		return res.status(404).json({ message: 'No email specified.' });
	}

	User.findOneAndUpdate(
		{ email: req.body.email },
		{ passwordReset: { token: sha1sum(uuid()), expiry: Date.now() + 60*60*24 } },
		{ new: true },
		function (err, user) {
			if (err) return res.status(500).json({ message: 'A server error has occurred. '});
			if (!user) return res.status(404).json({ message: 'No account found with this email address.' });

			var resetLink = createlink(req, '/user/reset/' + user.passwordReset.token);

			// send reset email
			postmark.send({
				'From': config.mailSender.email,
				'To': user.email,
				'Subject': 'Password Reset Request',
				'TextBody': 'Hello,\n\nWe have received a request to reset your password. If you would like to continue, please click the link below. If you did not request the password reset, you can safely ignore this email.\n\n{{link}}\n\nFrank.'.replace('{{link}}', resetLink),
				'Tag': 'passwordReset'
			}, function (error, success) {
				if (error) return res.status(500).json({ message: 'Error sending reset email.' });
				res.json({ message: 'Password reset email sent.' });
			});
		}
	);
};

// GET /user/reset/:token
exports.resetPasswordConfirm = function (req, res) {
	console.log(req.params);
	if (!req.params.token) {
		return res.status(404).send('File not found.');
	}

	var newPassword = generatePassword();

	// we can't use findOneAndUpdate here as that won't trigger
	// the 'save' pre-hook in the model, which we need for hashing
	// the new password
	User.findOne(
		{ 'passwordReset.token': req.params.token },
		function (err, user) {
			if (err) return res.status(500).json({ message: 'A server error has occurred. '});
			if (!user) return res.status(404).send('File not found.');

			user.passwordReset = {};
			user.password = newPassword;
			user.save(function (err) {
				if (err) return res.status(500).json({ message: 'A server error has occurred. '});

				// email new password
				postmark.send({
					'From': config.mailSender.email,
					'To': user.email,
					'Subject': 'New Password',
					'TextBody': 'Hello,\n\nYour new password for Lye Brary Anne is:\n\n{{pwd}}\n\nFrank.'.replace('{{pwd}}', newPassword),
					'Tag': 'newPassword'
				}, function (error, success) {
					if (error) return res.status(500).json({ message: 'Error sending new password.' });
					res.redirect(config.appPath + '/#/msg/reset');
				});
			});
		}
	);
};

exports.isRevokedToken = function(req, payload, done){
	var issuer = payload.iss;
	var tokenId = payload.jti;

	// see if token is in list of revoked tokens, then return true (revoked) or false (not revoked)
	return done(null, false);
};
