var config = require('../config.js');

module.exports = {
	template: require('../../templates/help.html'),
	data: function () {
		return {
			email: '',
			error: '',
			notice: '',
			finished: false
		};
	},
	methods: {
		passwordReset: function (e) {
			e.preventDefault();
			if (!this.email || !this.email.match(/@.+\./)) {
				this.error = 'You must specify an email address.';
				return;
			}
			this.$http.post('/user/reset', { email: this.email }, function (data, status, request) {
				this.error = '';
				this.notice = 'Thank you, a password reset link has been emailed to you. Please follow the instructions in that email.';
				this.finished = true;
			}).error(function (data, status, request) {
				// handle error
				this.error = data.message;
				this.notice = '';
			});
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