
// require filesystem
var fs = require('fs');

// require child_process::exec
var child_process = require('child_process');

// require GraphicsMagik
var gm = require('gm');

// require node's path
var node_path = require('path');

// acquire config settings
var config = require('../../config.js').config;

var	JPEG = config.JPEG,
	LOCAL = config.LOCAL,
	REMOTE = config.REMOTE,
	SUB = config.SUB,
	THUMBNAIL = config.THUMBNAIL;


// reference tools directory
var toolsDir;
(function() {
	var cwd = process.cwd();
	process.chdir('../tools');
	toolsDir = process.cwd();
	process.chdir(cwd);
})();

processPDFs(
	node_path.resolve('../../remote/convertable')
);
assureDirectoriesExist(
	REMOTE.archive,
	REMOTE.data
	);


// runs an executable tool
function execTool(cmd, fn) {
	var cwd = process.cwd();
	process.chdir(toolsDir);
	child_process.exec(cmd, function (error, stdout, stderr) {
	    if(error !== null) {
	      console.error('exec error: ' + error);
	    }
	    fn();
	});
	console.log('$ '+cmd);
	process.chdir(cwd);
};

// process and convert PDFs
function processPDFs(dir, relPath) {
	if(arguments.length < 2) relPath = dir;

	// push cwd
	var cwd = process.cwd();

	console.log('$ chdir('+dir+');');
	// change dirs onto this path
	process.chdir(dir);

	// scan the directory
	var files = fs.readdirSync('.');
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		var stats = fs.statSync(file);
		var subPath = process.cwd().substr(relPath.length);

		// if this is a directory
		if(stats.isDirectory()) {

			// build the dump path to this file
			var outPath = subPath+'/'+file;

			// check that this sub directory exists in the archive
			assureDirectoriesExist(

				// remote archive (source pdf)
				REMOTE.archive+outPath,

				// remote output
				REMOTE.data+'/'+SUB.full+outPath,

				// remote thumbnail
				REMOTE.data+'/'+SUB.thumb+outPath
			);

			// recurse on this subdirectory
			processPDFs(dir+'/'+file, relPath);
		}

		// if this file is a pdf
		else if(/\.pdf$/i.test(file)) {

			// prepare the path for the output file
			var outPath = REMOTE.data+'/'+SUB.full+subPath+'/'+file+'.jpg';

			// use ghost-script program to convert pdf to jpeg
			var cmd = 'gswin32c.exe -dNOPAUSE -dBATCH -sDEVICE=jpeg '
				+'-r'+JPEG.dpi+' '
				+'"-sOutputFile='+outPath+'" '
				+'"'+dir+'/'+file+'"';

			// shell execute command
			execTool(cmd, function() {

				// generate a thumbnail verison of the image
				// gm(THUMBNAIL.width, THUMBNAIL.height, '#000000')
				var thumbFile = REMOTE.data+'/'+SUB.thumb+subPath+'/'+file+'.jpg';
				gm(outPath)
					.thumb(THUMBNAIL.width, THUMBNAIL.height, thumbFile, 100, function(err) {
						if(err) console.err('failed to generate thubnail: '+err);
					})
					// .resize(THUMBNAIL.width, THUMBNAIL.height)
					// .write(, function(err) {
					// 	if(err) console.error('failed to generate thumbnail: '+err);
					// });
			});
		}

	}

	// pop cwd
	process.chdir(cwd);
}

// checks to make sure given directories exist, creates them otherwise
function assureDirectoriesExist() {
	for(var i=arguments.length-1; i>=0; i--) {
		var target = arguments[i];
		if(!fs.existsSync(target)) {
			fs.mkdirSync(target, 777);
		}
	}
}