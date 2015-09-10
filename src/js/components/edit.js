var config = require('../config.js');

module.exports = {
	template: require('../../templates/edit.html'),
	data: function () {
		return {
			mode: 'Edit',
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
			error: '',
			itemId: ''
		};
	},
	inherit: true,
	ready: function () {
		if (!this.currentParams) {
			this.error = 'No item specified.';
		} else {
			this.itemId = this.currentParams;
			this.loadItem();
		}
	},
	methods: {
		loadItem: function () {
			this.$http.get('/api/items/' + this.itemId, function (data, status, request) {
				this.$set('item', data);
			}).error(function (data, status, request) {
				// handle error
				this.error = data.message || 'A server error occurred.';
			});
		},
		saveItem: function (e) {
			e.preventDefault();
			if (this.item.title) {
				this.$http.put('/api/items/' + this.itemId, this.item, function (data, status, request) {
					// redirect back to listing
					this.redirect('listing');
				}).error(function (data, status, request) {
					// handle error
					this.error = data.message || 'A server error occurred.';
				});
			}
		},
		redirect: config.helpers.redirect,
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