
var DATABASE = 'excursion';

var mysql = require('./lib/mysql-pointer.js');
var rurl = require('./lib/rurl-get.js');

var error = function(str) {
	return JSON.stringify({
		error: str
	});
};

exports.handle = function(request, response) {
	var url = request.url;
	var match = /\/(.*)$/.exec(url);
	var rodbs = match[1];

	var getter = rurl.instance();
	getter.connect(DATABASE, function(err) {
		if(err) {
			response.end(
				error(err)
			);
		}
		getter.exec(rodbs, function(err, result) {
			if(err) {
				response.end(
					error(err)
				);
			}
			else {
				response.end(JSON.stringify(result));
			}
		});
	});
	
		/*
	var db = mysql.MySQL_Pointer('excursion');
	db.useTable(table);
	db.insert(params, function(err, results) {
		res.end(results);
	});
	*/

	return true;
};