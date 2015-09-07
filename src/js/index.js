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

				if (this.user.id) {
					var self = this;
					setTimeout(function () {
						self.currentView = window.location.hash.replace('#/', '') || 'listing';
					}, 0);
				} else {
					this.redirect('login');
				}
			},
			methods: {
				goTo: function (route, e) {
					e.preventDefault();
					if (this.user.id) {
						this.redirect(route);
					} else {
						this.redirect('login');
					}
				},
				loadToken: function () {
					return localStorage.getItem('jwt');
				},
				deleteToken: function () {
					localStorage.removeItem('jwt');
				},
				redirect: function (route) {
					window.location.hash = '#/' + route;
					this.currentView = route;
				}
			}
		});
	}
};

app.initialize();
