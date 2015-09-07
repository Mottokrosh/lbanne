var Vue = require('vue');
var jwt_decode = require('jwt-decode');

Vue.config.debug = true;

Vue.use(require('vue-resource'));

Vue.component('login', require('./components/login.js'));
Vue.component('add', require('./components/add.js'));
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
				currentView: ''
			},
			ready: function () {
				// log us in if we have a stored token
				var token = this.loadToken();
				if (token) {
					var decodedToken = jwt_decode(token);
					if (decodedToken) {
						decodedToken.token = token;
						this.$set('user', decodedToken);
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
					var route = window.location.hash.replace('#/', '') || 'listing';
					var openRoutes = ['login', 'logout', 'signup'];

					if (openRoutes.indexOf(route) !== -1 || this.user.id) {
						this.currentView = route;
					} else {
						window.location.hash = '#/login';
					}
				},
				logout: function (e) {
					e.preventDefault();
					this.$set('user', {});
					this.deleteToken();
					this.redirect('login');
				},
				loadToken: function () {
					return localStorage.getItem('jwt');
				},
				deleteToken: function () {
					localStorage.removeItem('jwt');
				},
				redirect: function (route) {
					window.location.hash = '#/' + route;
				}
			}
		});
	}
};

app.initialize();
