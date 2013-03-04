// require filesystem
var fs = require('fs');

// requires mime for easy static hosting
var mime = require('mime');

// handler function
exports.handle = function(request, response) {
	var path = __dirname+url;
	fs.readFile(path, 'binary', function(err, file) {
		if(err) {        
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			response.end();
			return;
		}

		response.writeHead(200, {'Content-Type': mime.lookup(path)});
		response.write(file, "binary");
		response.end();
	});
	return true;
};