var express = require('express'),
	Bourne = require('bourne'),
	bodyParser = require('body-parser'),
	db = new Bourne('data.json');
	router = express.Router();

router
	.use(function (req, res, next) {
		if (!req.user) req.user = {id:1};
		next();
	})
	.use(bodyParser.json())
	.route('/contact')
		.get(function (req, res) {
			db.find({ userID: parseInt(req.user.id, 10) }, function (err, data) {
				res.json(data);
			});
		})
		.post(function (req, res) {
			var contact = req.body;
			contact.userID = req.user.id;

			db.insert(contact, function (err, data) {
				res.json(data);
			});
		});

router
	.param('id', function (req, res, next) {
		req.dbQuery = { id: parseInt(req.params.id, 10 )}
	})
	.route('/contact/:id')
		.get(function (req, res) {
			db.findOne(req.dbQuery, function (err, data) {
				res.json(data);
			});
		})
		.put(function (req, res) {
			var contact = req.body;
			delete contact.$promise; //Variables that are passed by angular, and you don't want in the object when adding to the database
			delete contact.$resolved;
			db.update(req.dbQuery, contact, function (err, data) {
				res.json(data[0]); //only pass back one because you know you are updating on a single record
			})
		})
		.delete(function (req, res) {
			db.delete(req.dbQuery, function () {
				res.json(null);
			});
		});

module.exports = router;