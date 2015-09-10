var jwt_decode = require('jwt-decode');
var config = require('../config.js');

module.exports = {
	template: require('../../templates/login.html'),
	data: function () {
		return {
			auth: {
				email: '',
				password: ''
			},
			returnPath: window.location.pathname,
			error: ''
		};
	},
	inherit: true, // this inherits the data from the parent in a two-way binding
	methods: {
		authUser: function (e) {
			e.preventDefault();
			if (!this.auth.email || !this.auth.email.match(/@.+\./)) {
				this.error = 'You must specify an email address.';
				return;
			}
			if (!this.auth.password || this.auth.password < 8) {
				this.error = 'You must specify a password of at least 8 characters.';
				return;
			}
			this.$http.post('/user/authenticate', this.auth, function (data, status, request) {
				this.error = '';
				this.user = jwt_decode(data.token);
				this.user.token = data.token;
				this.$http.headers.common.Authorization = 'Bearer ' + data.token;
				this.saveToken(data.token);
				this.redirect(this.homeView);
			}).error(function (data, status, request) {
				// handle error
				this.error = data.message;
				this.auth.email = '';
				this.auth.password = '';
			});
		},
		redirect: config.helpers.redirect,
		saveToken: function (token) {
			localStorage.setItem('jwt', token);
		},
		close: function (e) {
			e.preventDefault();
			this.error = '';
		}
	}
};