module.exports = {
	types: ['Adventure', 'Campaign Setting', 'Rulebook'],
	formats: ['Physical', 'Digital (PDF)', 'Physical & Digital', 'Digital (Other)', 'Other'],
	levels: {
		default: {
			start: 1,
			end: 20,
		},
		limits: {
			start: 0,
			end: 64,
		}
	},
	helpers: {
		redirect: function (route) {
			window.location.href = window.location.pathname + '#/' + route;
		},
		loadToken: function () {
			return localStorage.getItem('jwt');
		},
		saveToken: function (token) {
			localStorage.setItem('jwt', token);
		},
		deleteToken: function () {
			localStorage.removeItem('jwt');
		}
	}
};