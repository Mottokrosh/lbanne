var mongoose = require('mongoose');
var config = require('../config/config');

var ItemSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: true, trim: true },
	library: { type: String, trim: true },
	type: { type: String, trim: true },
	system: { type: String, trim: true },
	format: { type: String, trim: true },
	startLevel: { type: Number, min: 0, max: 64 },
	endLevel: { type: Number, min: 0, max: 64 },
	author: { type: String, trim: true },
	publisher: { type: String, trim: true },
	tags: [{ type: String, lowercase: true, trim: true }]
});

module.exports = mongoose.model('Item', ItemSchema);
