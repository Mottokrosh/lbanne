var jwt_decode = require('jwt-decode');
var config = require('../config.js');

module.exports = {
	template: require('../../templates/register.html'),
	data: function () {
		return {
			account: {
				email: '',
				password: ''
			},
			error: '',
			notice: '',
			returnPath: window.location.pathname
		};
	},
	inherit: true, // this inherits the data from the parent in a two-way binding
	methods: {
		createAccount: function (e) {
			e.preventDefault();
			if (!this.account.email || !this.account.email.match(/@.+\./)) {
				this.error = 'You must specify an email address.';
				return;
			}
			if (!this.account.password || this.account.password < 8) {
				this.error = 'You must specify a password of at least 8 characters.';
				return;
			}
			this.$http.post('/user', this.account, function (data, status, request) {
				this.error = '';
				this.user = jwt_decode(data.token);
				this.user.token = data.token;
				this.$http.headers.common.Authorization = 'Bearer ' + data.token;
				this.saveToken(data.token);
				this.redirect(this.homeView);
			}).error(function (data, status, request) {
				// handle error
				this.error = data.message;
				this.account.email = '';
				this.account.password = '';
			});
		},
		redirect: config.helpers.redirect,
		saveToken: function (token) {
			localStorage.setItem('jwt', token);
		},
		close: function (target, e) {
			e.preventDefault();
			if (target === 'notice') {
				this.notice = '';
			} else {
				this.error = '';
			}
		}
	}
};