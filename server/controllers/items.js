// Load required packages
var Item = require('../models/item');
var config = require('../config/config');

// POST /api/items
exports.createItem = function (req, res) {
	var item = new Item({
		title: req.body.title,
		library: req.body.library || 'Default',
		type: req.body.type,
		system: req.body.system,
		startLevel: parseInt(req.body.startLevel, 10) || undefined,
		endLevel: parseInt(req.body.endLevel, 10) || undefined,
		author: req.body.author,
		publisher: req.body.publisher,
		tags: req.body.tags
	});

	item.save(function (err) {
		if (err) res.send(err);

		res.status(201).json(item);
	});
};

// GET /api/items
exports.getItems = function (req, res) {
	Item.find(function (err, items) {
		if (err) res.send(err);

		res.json(items);
	});
};

// GET /api/items/:id
exports.getItem = function (req, res) {
	Item.findById(req.params.id, function (err, item) {
		if (err) res.send(err);

		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}

		res.json(item);
	});
};

// PUT /api/items/:id
exports.updateItem = function (req, res) {
	Item.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, item) {
		if (err) res.send(err);

		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}

		res.json(item);
	});
};

// DELETE /api/items/:id
exports.deleteItem = function (req, res) {
	Item.findByIdAndRemove(req.params.id, function (err, item) {
		if (err) res.send(err);

		if (!item) {
			return res.status(404).json({ message: 'Item not found.' });
		}

		res.json(item);
	});
};

