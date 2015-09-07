var jwt_decode = require('jwt-decode');

module.exports = {
	template: require('../../templates/login.html'),
	data: function () {
		return {
			user: {
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
			if (!this.user.email || !this.user.email.match(/@.+\./)) {
				this.errorMsg = 'You must specify an email address.';
				return;
			}
			if (!this.user.password || this.user.password < 8) {
				this.errorMsg = 'You must specify a password of at least 8 characters.';
				return;
			}
			this.$http.post('/user/authenticate', this.user, function (data, status, request) {
				this.errorMsg = '';
				this.user = jwt_decode(data.token);
				this.user.token = data.token;
				this.saveToken(data.token);
				this.redirect('listing');
			}).error(function (data, status, request) {
				// handle error
				this.errorMsg = data.message;
				this.user.email = '';
				this.user.password = '';
			});
		},
		signUp: function (e) {
			e.preventDefault();
		},
		lostPassword: function (e) {
			e.preventDefault();
		},
		redirect: function (route) {
			window.location.hash = '#/' + route;
			this.currentView = route;
		},
		saveToken: function (token) {
			localStorage.setItem('jwt', token);
		}
	}
};