module.exports = {
	template: require('../../templates/add.html'),
	data: function () {
		return {
			item: {
				title: '',
				type: '',
				system: '',
				format: '',
				startLevel: 1,
				endLevel: 20,
				author: '',
				publisher: ''
			},
			types: ['Adventure', 'Campaign Setting', 'Rulebook'],
			formats: ['Physical', 'Digital (PDF)', 'Digital (Other)', 'Other'],
			notice: '',
			error: ''
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
					this.$set('item', {
						title: '',
						type: '',
						system: '',
						format: '',
						startLevel: 1,
						endLevel: 20,
						author: '',
						publisher: ''
					});
				}).error(function (data, status, request) {
					// handle error
				});
			}
		}
	}
};