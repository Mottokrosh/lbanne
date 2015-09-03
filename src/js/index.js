var Vue = require('vue');

var app = {
	insideWebView: window.location.protocol === 'file:',

	//
	// Application Constructor
	//
	initialize: function () {
		this.bindEvents();
	},

	//
	// Bind Event Listeners
	//
	bindEvents: function () {
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
				items: []
			},
			ready: function () {
				this.fetchItems();
			},
			methods: {
				fetchItems: function () {
					var exampleItems = [
						{
							title: 'Merry Popper and the Strudle',
							type: 'Novel',
							system: 'N/A',
							startLevel: 1,
							endLevel: 10,
							author: 'Jenny Brooks',
							tags: ['magic', 'unicorns']
						},
						{
							title: 'Merry Popper Down And Under',
							type: 'Novel',
							system: 'N/A',
							startLevel: 10,
							endLevel: 15,
							author: 'Jenny Brooks',
							tags: ['feathers', 'tarts', 'sorbet']
						}
					];
					this.$set('items', exampleItems);
				},
				addItem: function (e) {
					e.preventDefault();
					if (this.item.title) {
						this.items.push(this.item);
						this.item = { title: '', type: '', system: '' };
					}
				},
				removeItem: function (e, item) {
					e.preventDefault();
					if (confirm('Are you sure you want to remove this item?')) {
						this.items.$remove(item);
					}
				}
			}
		});
	}
};

app.initialize();