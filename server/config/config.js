module.exports = {

	secret: process.env.SECRET || 'sadias8hdasnj4*ndsajKj£ndsk$$dsaj*87',
	database: process.env.MONGOLAB_URI || 'mongodb://heroku_l8pph8pz:vv2eu74u12sfu5e0crul32ojev@ds033153.mongolab.com:33153/heroku_l8pph8pz',
	jwtAudience: 'http://localhost:8000/api',
	jwtIssuer: 'http://localhost:8000',
	socialAuth: {
		facebook: {
			clientID: process.env.FACEBOOK_ID || '754220301289665',
			clientSecret: process.env.FACEBOOK_SECRET || '41860e58c256a3d7ad8267d3c1939a4a',
			callbackURL: '/auth/facebook/callback',
			passReqToCallback: true
		},

		github: {
			clientID: process.env.GITHUB_ID || 'cb448b1d4f0c743a1e36',
			clientSecret: process.env.GITHUB_SECRET || '815aa4606f476444691c5f1c16b9c70da6714dc6',
			callbackURL: '/auth/github/callback',
			passReqToCallback: true
		},

		twitter: {
			consumerKey: process.env.TWITTER_KEY || '6NNBDyJ2TavL407A3lWxPFKBI',
			consumerSecret: process.env.TWITTER_SECRET  || 'ZHaYyK3DQCqv49Z9ofsYdqiUgeoICyh6uoBgFfu7OeYC7wTQKa',
			callbackURL: '/auth/twitter/callback',
			passReqToCallback: true
		},

		google: {
			clientID: process.env.GOOGLE_ID || '564153657812-2auulqrqfjo2gkcm780s8dmmn7i432dq.apps.googleusercontent.com',
			clientSecret: process.env.GOOGLE_SECRET || 'AgSb8YJXHvdh7-AnbxjWs-BS',
			callbackURL: '/auth/google/callback',
			passReqToCallback: true
		}
	}

};
