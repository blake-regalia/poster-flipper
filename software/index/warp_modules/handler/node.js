
var mysql = require('./lib/mysql-pointer.js');
var rurl = require('./lib/rurl-get.js');

exports.handle = function(request, response) {
	var url = request.url;
	var match = /^([a-z]+)\.([a-z]+)\?([^=]+=[^&]*&?)$/.exec(url);
	if(match == null) {
		response.end('Node file not found');
		return true;
	}
	var table = match[1];
	var oper = match[2];
	var query = match[3];
	var params = {};
	var paramChunks = query.split(/\&/g);
	for(var i=0; i<paramChunks.length; i++) {
		var qpa = paramChunks[i].split(/=/);
		params[qpa[0]] = qpa[1];
	}

	var getter = rurl.instance();
	console.log('getter:');
	getter.connect('excursion', function() {
		getter.exec('user@.(fullname like "blake%")', function(result) {
			response.end(JSON.stringify(result));
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