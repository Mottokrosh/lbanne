module.exports = {
	template: require('../../templates/add.html'),
	data: function () {
		return {
			item: { title: '', type: '', system: '' },
			types: ['Adventure', 'Campaign Setting', 'Rulebook']
		};
	},
	ready: function () {
		//console.log(this.items);
	},
	methods: {
		addItem: function (e) {
			e.preventDefault();
			if (this.item.title) {
				this.$http.post('/api/items', this.item, function (data, status, request) {
					this.item = { title: '', type: '', system: '' };
				}).error(function (data, status, request) {
					// handle error
				});
			}
		}
	}
};