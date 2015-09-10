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
			errorMsg: ''
		};
	},
	inherit: true, // this inherits the data from the parent in a two-way binding
	methods: {
		authUser: function (e) {
			e.preventDefault();
			if (!this.auth.email || !this.auth.email.match(/@.+\./)) {
				this.errorMsg = 'You must specify an email address.';
				return;
			}
			if (!this.auth.password || this.auth.password < 8) {
				this.errorMsg = 'You must specify a password of at least 8 characters.';
				return;
			}
			this.$http.post('/user/authenticate', this.auth, function (data, status, request) {
				this.errorMsg = '';
				this.user = jwt_decode(data.token);
				this.user.token = data.token;
				this.$http.headers.common.Authorization = 'Bearer ' + data.token;
				this.saveToken(data.token);
				this.redirect(this.homeView);
			}).error(function (data, status, request) {
				// handle error
				this.errorMsg = data.message;
				this.auth.email = '';
				this.auth.password = '';
			});
		},
		signUp: function (e) {
			e.preventDefault();
		},
		lostPassword: function (e) {
			e.preventDefault();
		},
		redirect: config.helpers.redirect,
		saveToken: function (token) {
			localStorage.setItem('jwt', token);
		}
	}
};