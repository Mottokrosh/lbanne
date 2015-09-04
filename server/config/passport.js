var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('../models/user');

//
// Sign in, sign up or connect with a Google account
//

passport.use(new GoogleStrategy(config.socialAuth.google, function (req, accessToken, refreshToken, profile, done) {
	var userTokenData, returnTo;

	if (req.session) {
		// see if we have a JWT in the session
		userTokenData = User.decodeToken(req.session.jwt);

		// look for a return URL (used by web apps)
		returnTo = req.session.returnTo;

		// destroy the session
		req.session.destroy();
	}

	if (userTokenData) {
		// we have a signed in user, so we're dealing with a user wanting to connect a social account
		// to his local account - let's try and find their local account
		User.findOne({ googleID: profile.id }, function (err, existingUser) {
			if (existingUser) {
				// signed in user, already connected, let's update the profile
				existingUser.profile.name = profile.displayName;
				existingUser.profile.picture = profile.photos && profile.photos.length ? profile.photos[0].value : '';
				existingUser.save(function (err) {
					done(err, existingUser);
				});
			} else {
				// signed in user but not connected yet, so let's connect
				User.findById(userTokenData.id, function (err, user) {
					user.googleID = profile.id;
					user.profile.name = profile.displayName;
					user.profile.picture = profile.photos && profile.photos.length ? profile.photos[0].value : '';
					user.save(function (err) {
						done(err, user);
					});
				});
			}
		});
	} else {
		// we have a non-signed in user, so they're trying to sign in or register via a social account -
		// let's try and find a local account with these connected social details
		User.findOne({ googleID: profile.id }, function (err, existingUser) {
			if (existingUser) {
				// this user has a local account, let's update it, then consider them signed in
				existingUser.profile.name = profile.displayName;
				existingUser.profile.picture = profile.photos && profile.photos.length ? profile.photos[0].value : '';
				existingUser.save(function (err) {
					done(err, existingUser);
				});
			} else {
				// this user's not in the system yet, let's check for a local account with this social profile's email
				User.findOne({ email: profile.emails[0].value }, function (err, existingLocalUser) {
					if (existingLocalUser) {
						// this email is already in the system, advise to login & connect instead
						existingLocalUser.error = 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.';
						done(err, existingLocalUser);
					} else {
						// this user is not in the system yet, let's sign them up for a local, connected account
						var user = new User();
						user.email = profile.emails[0].value;
						user.googleID = profile.id;
						user.profile.name = profile.displayName;
						user.profile.picture = profile.photos && profile.photos.length ? profile.photos[0].value : '';
						user.save(function (err) {
							done(err, user);
						});
					}
				});
			}
		});
	}

}));