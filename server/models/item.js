var mongoose = require('mongoose');
var config = require('../config/config');

var ItemSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	library: { type: String, trim: true },
	type: { type: String, trim: true },
	system: { type: String, trim: true },
	startLevel: { type: Number, min: 1, max: 20 },
	endLevel: { type: Number, min: 1, max: 20 },
	author: { type: String, trim: true },
	publisher: { type: String, trim: true },
	tags: [{ type: String, lowercase: true, trim: true }]
});

module.exports = mongoose.model('Item', ItemSchema);
