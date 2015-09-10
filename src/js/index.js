var Vue = require('vue');
var jwt_decode = require('jwt-decode');
var queryString = require('query-string');
var config = require('./config.js');

Vue.config.debug = true;

Vue.use(require('vue-resource'));

Vue.component('login', require('./components/login.js'));
Vue.component('register', require('./components/register.js'));
Vue.component('add', require('./components/add.js'));
Vue.component('edit', require('./components/edit.js'));
Vue.component('listing', require('./components/listing.js'));

var app = {
	insideWebView: window.location.protocol === 'file:',

	//
	// Application Constructor
	//
	initialize: function () {
		if (this.insideWebView) {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		} else {
			this.onDeviceReady();
		}
	},

	//
	// Deviceready Event Handler
	//
	onDeviceReady: function () {
		new Vue({
			el: '#lbanne',
			data: {
				user: {},
				currentView: '',
				currentParams: '',
				homeView: 'listing'
			},
			ready: function () {
				// look for a token query string parameter
				// (such as from a successful social auth redirect)
				if (window.location.search) {
					var parsed = queryString.parse(window.location.search);
					if (parsed.token) {
						// save token locally and redirect (to lose the query string)
						// (we're not bothering to validate the token, that'll happen below)
						this.saveToken(parsed.token);
						this.redirect(this.homeView);
					}
				}

				// log us in if we have a stored token
				var token = this.loadToken();
				if (token) {
					var user = this.userFromToken(token);
					if (user) {
						this.$set('user', user);
						Vue.http.headers.common.Authorization = 'Bearer ' + user.token;
					} else {
						// problem decoding token, likely expired
						this.deleteToken();
					}
				}

				// start listening to route changes
				window.addEventListener('hashchange', this.hashChangeHandler, false);
				this.hashChangeHandler();
			},
			methods: {
				hashChangeHandler: function () {
					var route = window.location.hash.replace('#/', '') || this.homeView;
					var openRoutes = ['login', 'logout', 'register', 'lost-password'];
					var segments;

					if (route.match(/\//)) {
						segments = route.split('/');
						route = segments[0];
					}

					if (openRoutes.indexOf(route) !== -1 || this.user.id) {
						this.currentView = route;
						if (segments) { this.currentParams = segments[1]; }
					} else {
						window.location.hash = '#/login';
					}
				},
				userFromToken: function (encodedToken) {
					var user = null;
					try {
						user = jwt_decode(encodedToken);
					} catch (e) {
						console.log(e);
					}
					if (user) {
						user.token = encodedToken;
					}
					return user;
				},
				logout: function (e) {
					e.preventDefault();
					this.$set('user', {});
					Vue.http.headers.common.Authorization = undefined;
					this.deleteToken();
					this.redirect('login');
				},
				loadToken: function () {
					return localStorage.getItem('jwt');
				},
				saveToken: function (token) {
					localStorage.setItem('jwt', token);
				},
				deleteToken: function () {
					localStorage.removeItem('jwt');
				},
				redirect: config.helpers.redirect
			}
		});
	}
};

app.initialize();
