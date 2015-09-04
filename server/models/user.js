var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var uuid = require('uuid');
var config = require('../config/config');

var UserSchema = new mongoose.Schema({

	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},

	password: {
		type: String
	},

	googleID: String,
	facebookID: String,
	twitterID: String,
	githubID: String,

	profile: {
		name: { type: String, default: '' },
		picture: { type: String, default: '' }
	}

});

UserSchema.pre('save', function (next) {
	var user = this;
	if (this.password && (this.isModified('password') || this.isNew)) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.verifyPassword = function (passw, cb) {
	if (!passw) cb(null, false);
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

UserSchema.methods.generateToken = function () {
	// pull out what we want in the token payload
	var sanUser = {
		id: this.id,
		email: this.email,
		jti: uuid.v4() // jwt doesn't support JWT ID claims out of the box, so we're handling it here
	};

	// create a token
	var token = jwt.sign(sanUser, config.secret, {
		expiresInMinutes: 1440, // expires in 24 hours
		audience: config.jwtAudience,
		issuer: config.jwtIssuer
	});

	return token;
};

UserSchema.statics.decodeToken = function (token) {
	var decodedToken = null;

	if (token) {
		try {
			decodedToken = jwt.verify(token, config.secret, {
				audience: config.jwtAudience,
				issuer: config.jwtIssuer
			});
		} catch (err) {
			console.log(err);
		}
	}

	return decodedToken;
};

module.exports = mongoose.model('User', UserSchema);
