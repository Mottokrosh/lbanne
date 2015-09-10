module.exports = {
	template: require('../../templates/listing.html'),
	data: function () {
		return {
			items: [],
			systems: [],
			types: ['Adventure', 'Campaign Setting', 'Rulebook'],
			formats: ['Physical', 'Digital (PDF)', 'Physical & Digital', 'Digital (Other)', 'Other'],
			search: {
				title: '',
				type: '',
				system: '',
				format: ''
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