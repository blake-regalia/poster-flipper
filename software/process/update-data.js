
// require filesystem
var fs = require('fs');

// acquire config settings
var config = require('../config.js').config;

var	JPEG = config.JPEG,
	LOCAL = config.LOCAL,
	REMOTE = config.REMOTE,
	SUB = config.SUB,
	THUMBNAIL = config.THUMBNAIL;

// start the script
updateDir('');

function updateDir(sub) {
	var cwd = process.cwd();
	process.chdir(REMOTE.data+sub);
	
	assureDirectoriesExist(LOCAL.data+sub);
	
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
			var localPath = LOCAL.data+path;
			try {
				if(fs.existsSync(localPath)) {
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