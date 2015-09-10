var mongoose = require('mongoose');
var config = require('../config/config');

var ItemSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: true, trim: true, maxlength: 256 },
	library: { type: String, trim: true, maxlength: 128 },
	type: { type: String, trim: true, maxlength: 128 },
	system: { type: String, trim: true, maxlength: 128 },
	format: { type: String, trim: true, maxlength: 128 },
	startLevel: { type: Number, min: 0, max: 64 },
	endLevel: { type: Number, min: 0, max: 64 },
	author: { type: String, trim: true, maxlength: 128 },
	publisher: { type: String, trim: true, maxlength: 128 },
	tags: [{ type: String, lowercase: true, trim: true, maxlength: 64 }]
});

module.exports = mongoose.model('Item', ItemSchema);
