// relative path to the poster file data
var posterDataPath = '../../Poster File Data';

// define server port
var serverPort = 2225;

// require filesystem
var fs = require('fs');

// require express
var express = require('express');
var app = express();

// use "../../Poster File Data" dir to serve data requests
app.use('/data', express.static(__dirname+'/'+posterDataPath));

// allow resource dir to be static
app.use('/resource', express.static(__dirname+'/resource'));

// for the poster data
app.get('/server/get-posters.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.end(
		JSON.stringify(
			getPosterJson('')
		)
	);
});

// for the index page
app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	fs.readFile(__dirname+'/index.html','utf-8', function(err, data) {
		if(err) {
			res.end('failed to open index file');
		}
		else {
			res.end(data);
		}
	});
});

app.listen(serverPort);
console.log('server running at: http://localhost:'+serverPort);

// extend function
function __() {
	var obj = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		var arg = arguments[i];
		for(var e in arg) {
			obj[e] = arg[e];
		}
	}
	return obj;
}

// scan directories
function getPosterJson(path) {
	var pdp = posterDataPath+'/full'+path;
	var files = fs.readdirSync(pdp);
	
	var res = {name: path, type:'dir', thumb:'resource/folder.png'};
	var resDirs = [{
		type: 'dir',
		name: '',
		thumb: 'resource/directory.up.png'
	}];
	var resFiles = [];
	
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		var stats = fs.statSync(pdp+'/'+file);
		if(!stats) continue;
		if(stats.isDirectory()) {
			resDirs.push(
				__(getPosterJson(path+'/'+file), {
					name: file,
				})
			);
		}
		else if(stats.isFile()) {
			if(/\.jpe?g/i.test(file)) {
				resFiles.push({
					title: file.substr(0, file.lastIndexOf('.')),
					src: 'data/full'+path+'/'+file,
					thumb: 'data/thumb'+path+'/'+file,
					type: 'image',
				});
			}
		}
	}
	
	res.files = resDirs.concat(resFiles);
	return res;
}
