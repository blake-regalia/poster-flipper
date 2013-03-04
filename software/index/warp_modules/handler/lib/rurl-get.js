var mysql = require('mysql');
var parser = require('./rurl-parser.js').parser;

exports.instance = function() {

	var parseError = '';
	parser.yy.parseError = function(e) {
		parseError = e;
	};

	var db = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
	});

	return {
		connect: function(databaseName, fn) {
			db.query("USE "+databaseName, function(err, res) {
				fn(err, res);
			});
		},
		exec: function(input, fn) {
			try {
				var query = parser.parse(input);
				db.query(query.sql, function(err, res) {
					fn(err, res);
				});
			} catch(e) {
				fn({
					parseError: parseError
				});
			}
		},
	};
};
