
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
processVids(
	REMOTE.source
);

processCommandQueue();



// process and convert PDFs
function processVids(dir, relPath) {
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
			processVids(dir+'/'+file, relPath);
		}

		// if this file is a video
		else if(/\.(mp4|ogv|webmv|webm|flv|mov)$/i.test(file)) {

			// prepare the path for the output file
			var thumbPath = REMOTE.data+'/'+SUB.thumb+subPath+'/'+file;
			var input = dir+'/'+file;

			// generate thumbnail
			var ss = getDuration(input) * 0.15; // get duration at 15%
			var cmd = ['"ffmpeg.exe" -i '
				+input+' '
				+'-an -y -f mjpeg '
				+'-ss '+ss+' '
				+'-s '+THUMBNAIL.width+'x'+THUMBNAIL.height+' '
				+'-vframes 1 '
				+thumbPath, subPath+'/'+file];
			
			commandQueue.push(cmd);
			functionQueue.push((function() {
				// copy file to archive and move source to destination
				var source = this.source;
				var archiveDest = this.archiveDest;
				var thumbFile = this.thumbFile;
				return function(fn) {
					copyFile(source, archiveDest, function() {
						moveFile(source, archiveDest, function() {
							
						});
					});
				};
			}).apply({
				source: dir+'/'+file,
				archiveDest: REMOTE.archive+subPath+'/'+file,
				fullFile: REMOTE.data+'/'+SUB.full+subPath+'/'+file
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
// moves file
function moveFile(source, target, cb) {
	fs.rename(source, target, cb);
}

function getDuration(file, fn) {
	child_process.exec($ffmpeg.' -i '.$file.' 2>&1', function(stdout) {
		var duration = /Duration: (.*?)[.]/.exec(ignore, stdout);

		var times = duration[1].split(/[:]/g);
		var hours = times[0];
		var mins = times[1];
		var secs = times[2];
		
		return hours*60*60 + mins*60 + secs;
	});
}