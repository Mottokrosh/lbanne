var config = require('../config.js');

module.exports = {
	template: require('../../templates/listing.html'),
	data: function () {
		return {
			items: [],
			systems: [],
			types: config.types,
			formats: config.formats,
			levels: {
				start: config.levels.limits.start,
				end: config.levels.limits.end
			},
			search: {
				title: '',
				type: '',
				system: '',
				format: '',
				startLevel: null,
				endLevel: null
			}
		};
	},
	ready: function () {
		this.fetchSystems();
		this.fetchItems();
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
	}
};