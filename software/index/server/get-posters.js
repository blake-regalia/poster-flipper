
// require filesystem
var fs = require('fs');

exports.run = function() {
	return JSON.stringify(getPosterJson(''));
};

// relative path to the poster file data
var posterDataPath = '../../Poster File Data';


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
	res.files = [];
	
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		var stats = fs.statSync(pdp+'/'+file);
		if(!stats) continue;
		if(stats.isDirectory()) {
			res.files.push(
				__(getPosterJson(path+'/'+file), {
					name: file,
				})
			);
		}
		else if(stats.isFile()) {
			if(/\.jpe?g/i.test(file)) {
				res.files.push({
					title: file.substr(0, file.lastIndexOf('.')),
					src: 'data/full'+path+'/'+file,
					thumb: 'data/thumb'+path+'/'+file,
					type: 'image',
				});
			}
		}
	}
	
	return res;
}
