module.exports = {

	secret: process.env.SECRET,
	database: process.env.MONGOLAB_URI,
	/*jwtAudience: 'http://localhost:8000/api',
	jwtIssuer: 'http://localhost:8000',*/
	socialAuth: {
		facebook: {
			clientID: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET,
			callbackURL: '/auth/facebook/callback',
			passReqToCallback: true
		},

		github: {
			clientID: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: '/auth/github/callback',
			passReqToCallback: true
		},

		twitter: {
			consumerKey: process.env.TWITTER_KEY,
			consumerSecret: process.env.TWITTER_SECRET,
			callbackURL: '/auth/twitter/callback',
			passReqToCallback: true
		},

		google: {
			clientID: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: '/auth/google/callback',
			passReqToCallback: true
		}
	}

};
