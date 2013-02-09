// relative path to the poster file data
var posterDataPath = '../../Poster File Data';

// require filesystem
var fs = require('fs');

// require express
var express = require('express');
var app = express();

// use "../../Poster File Data" dir to serve data requests
app.use('/data', express.static(__dirname+'/'+posterDataPath));

// allow resource dir to be static
app.use('/resource', express.static(__dirname+'/resource'));

// for the index page
app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	fs.readFile('index.html','utf-8', function(err, data) {
		if(err) {
			res.end('failed to open index file');
		}
		else {
			res.write(data);
			getPosterJson(function(js) {
				res.end('<script type="text/javascript">\n'+js+'\n</script>');
			});
		}
	});
});

app.listen(2013);


function getPosterJson(fn) {
	var pdp = posterDataPath+'/full/';
	fs.readdir(pdp, function(err, files) {
		if(err) return fn('/* critical filesystem error */');
		
		console.log(files);
		
		var relpath = '';
		var res = {':thumbSrc':'resource/folder.png'};
		for(var i=files.length-1; i>=0; i--) {
			var file = files[i];
			var path = pdp+relpath+file;
			var stats = fs.statSync(path);
			if(!stats) continue;
			if(stats.isDirectory()) {
			
			}
			else if(stats.isFile()) {
				if(/\.jpe?g/i.test(file)) {
					res[file] = {
						':title': file.substr(0, file.lastIndexOf('.')),
						':src': 'data/full/'+relpath+file,
						':thumbSrc': 'data/thumb/'+relpath+file,
						':type': 'image',
					};
				}
			}
		}
		fn('var res='+JSON.stringify(res)+';');
	});
}
