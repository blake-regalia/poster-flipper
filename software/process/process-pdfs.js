
// require filesystem
var fs = require('fs');

// require child_process::exec
var child_process = require('child_process');

// require GraphicsMagik
var gm = require('gm');

// require node's path
var node_path = require('path');

// acquire config settings
var config = require('../config.js').config;

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


var commandQueue = [];
var functionQueue = [];

assureDirectoriesExist(
	REMOTE.archive,
	REMOTE.data,
	REMOTE.data+'/'+SUB.full,
	REMOTE.data+'/'+SUB.thumb
	);
processPDFs(
	REMOTE.source
);

processCommandQueue();



// process and convert PDFs
function processPDFs(dir, relPath) {
	if(arguments.length < 2) relPath = dir;

	// push cwd
	var cwd = process.cwd();

	// change dirs onto this path
	process.chdir(dir);

	// scan the directory
	var files = fs.readdirSync('.');
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		
		process.chdir(dir);
		
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
			var cmd = ['gswin32c.exe -dNOPAUSE -dBATCH -sDEVICE=jpeg '
				+'-r'+JPEG.dpi+' '
				+'"-sOutputFile='+outPath+'" '
				+'"'+dir+'/'+file+'"', subPath+'/'+file];
			
			commandQueue.push(cmd);
			functionQueue.push((function() {
				// generate a thumbnail verison of the image
				var source = this.source;
				var archiveDest = this.archiveDest;
				var thumbFile = this.thumbFile;
				return function(fn) {
					gm(outPath)
						.resize(THUMBNAIL.width, THUMBNAIL.height)
						.geometry(THUMBNAIL.width, THUMBNAIL.height)
						.write(thumbFile, function(err) {
							if(err) console.error('failed to generate thumbnail: '+err);
							copyFile(source, archiveDest, function() {
								fs.unlink(source, fn);
							});
						});
				};
			}).apply({
				source: dir+'/'+file,
				archiveDest: REMOTE.archive+subPath+'/'+file,
				thumbFile: REMOTE.data+'/'+SUB.thumb+subPath+'/'+file+'.jpg'
			}));
		}

	}

	// pop cwd
	process.chdir(cwd);
}

function processCommandQueue() {
	if(!commandQueue.length) {
		processFunctionQueue();
	}
	else {
		var cmd = commandQueue.shift();
		var cwd = process.cwd();
		process.chdir(toolsDir);
		console.log('$ '+cmd[1]);
		child_process.exec(cmd[0], function(err) {
			if(err) {
				console.error(err);
				process.exit(1);
			}
			else {
				processCommandQueue();
			}
		});
		process.chdir(cwd);
	}
};

function processFunctionQueue() {
	if(!functionQueue.length) {
		return;
	}
	else {
		var fn = functionQueue.shift();
		fn(function() {
			processFunctionQueue();
		});
	}
};

// checks to make sure given directories exist, creates them otherwise
function assureDirectoriesExist() {
	for(var i=0; i<arguments.length; i++) {
		var target = arguments[i];
		if(!fs.existsSync(target)) {
			fs.mkdirSync(target, 777);
		}
	}
}



// copies file
function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
		rd.on("error", function(err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
		wr.on("error", function(err) {
		done(err);
	});
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if(!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}