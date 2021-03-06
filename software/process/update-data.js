
// require filesystem
var fs = require('fs');

// require path
var node_path = require('path');

// acquire config settings
var config = require('../config.js').config;

var	JPEG = config.JPEG,
	LOCAL = config.LOCAL,
	REMOTE = config.REMOTE,
	SUB = config.SUB,
	THUMBNAIL = config.THUMBNAIL;
	
var localData = node_path.resolve(LOCAL.data);

// hash of files we've accounted for
var history = {};

// start the script
updateDir('');

function updateDir(sub) {
	var cwd = process.cwd();
	process.chdir(REMOTE.data+sub);
	
	assureDirectoriesExist(
		localData+sub
		);
	
	var files = fs.readdirSync('.');
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		var stats = fs.statSync(file);
		var path = sub+'/'+file;
		
		// if its a directory
		if(stats.isDirectory()) {
			updateDir(path);
		}
		
		// copy file from source to dest
		else {
			var copy = true;
			var localPath = localData+path;
			try {
				if(fs.existsSync(localPath)) {
					history[localPath] = true;
					var localStat = fs.statSync(localPath);
					if((localStat.size == stats.size) && (localStat.mtime == stats.mtime)) {
						copy = false;
					}
				}
			} catch(e) {}
			if(copy) {
				copyFile(REMOTE.data+path, localPath, function(err) {
					if(err) {
						console.error('failed to copy from remote directory');
						process.exit(1);
					}
				});
			}
		}
	}

	// removes data
	/*
	files = fs.readdirSync(localData+sub);
	for(var i=files.length-1; i>=0; i--) {
		var file = files[i];
		var stat = fs.statSync(file);
		if(stat && !stat.isDirectory()) {
			var localPath = localData+sub+'/'+file;
			if(!history[localPath]) {
				fs.unlinkSync(localPath);
			}
		}
	}
	*/
	
	process.chdir(cwd);
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