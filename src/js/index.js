var Vue = require('vue');

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
				var self = this;
				setTimeout(function () {
					self.currentView = window.location.hash.replace('#/', '') || 'listing';
				}, 0);
			},
			methods: {
				goTo: function (route) {
					this.currentView = route || 'listing';
				}
			}
		});
	}
};

app.initialize();
