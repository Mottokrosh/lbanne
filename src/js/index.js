var Vue = require('vue');

Vue.use(require('vue-resource'));

Vue.component('login', require('./components/login.js'));

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
				item: { title: '', type: '', system: '' },
				items: [],
				types: ['Adventure', 'Campaign Setting', 'Rulebook'],
				systems: [],
				search: {
					title: '',
					type: '',
					system: ''
				},
				currentView: 'test1'
			},
			ready: function () {
				this.fetchSystems();
				this.fetchItems();
			},
			components: {
				test1: {
					template: '<div><h1>Test One!</h1><p>{{foo}}</p></div>',
					data: function () {
						return { foo: 'bar' };
					}
				},
				test2: {
					template: '<div><h1>Test Two!</h1><p>{{foo}}</p></div>',
					data: function () {
						return { foo: 'another thing' };
					}
				}
			},
			methods: {
				fetchSystems: function () {
					this.$http.get('/api/systems', function (data, status, request) {
						this.$set('systems', data);
					}).error(function (data, status, request) {
						// handle error
					});
				},
				fetchItems: function () {
					this.$http.get('/api/items', function (data, status, request) {
						this.$set('items', data);
					}).error(function (data, status, request) {
						// handle error
					});
				},
				goTo: function (route) {
					window.location.hash = '#/' + route;
					this.currentView = route;
				},
				addItem: function (e) {
					e.preventDefault();
					if (this.item.title) {
						this.$http.post('/api/items', this.item, function (data, status, request) {
							this.items.push(JSON.stringify(data));
							this.item = { title: '', type: '', system: '' };
						}).error(function (data, status, request) {
							// handle error
						});
					}
				},
				removeItem: function (e, item) {
					e.preventDefault();
					if (confirm('Are you sure you want to remove this item?')) {
						this.$http.delete('/api/items/' + item._id, function (data, status, request) {
							this.items.$remove(item);
						}).error(function (data, status, request) {
							// handle error
						});
					}
				},
				toggleView: function (e) {
					e.preventDefault();
					if (this.currentView === 'test1') {
						this.currentView = 'test2';
					} else {
						this.currentView = 'test1';
					}
				}
			}
		});
	}
};

app.initialize();
