var config = require('../config.js');

module.exports = {
	template: require('../../templates/add.html'),
	data: function () {
		return {
			item: {
				title: '',
				type: '',
				system: '',
				format: '',
				startLevel: config.levels.default.start,
				endLevel: config.levels.default.end,
				author: '',
				publisher: ''
			},
			types: config.types,
			formats: config.formats,
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
						startLevel: config.levels.default.start,
						endLevel: config.levels.default.end,
						author: '',
						publisher: ''
					});
					this.notice = data.title + ' added.';
					document.querySelectorAll('#item-title')[0].focus();
				}).error(function (data, status, request) {
					// handle error
					this.error = data.message || 'A server error occurred.';
				});
			}
		},
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