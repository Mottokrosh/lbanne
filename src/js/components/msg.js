var config = require('../config.js');

module.exports = {
	template: require('../../templates/msg.html'),
	data: function () {
		return {
			notice: '',
			error: ''
		};
	},
	inherit: true,
	ready: function () {
		switch (this.currentParams) {
			case 'verified':
				this.notice = 'Thank you for verifying your email address.';
				break;
			case 'reset':
				this.notice = 'A new password has been emailed to you. Please use it to login.';
				break;
			default:
				this.error = 'No message type specified.';
				break;
		}
	},
	methods: {
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