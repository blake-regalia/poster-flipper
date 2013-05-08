
var root = 'Q:/Posters';

exports.config = {

	LOCAL: {
		data: '../../Poster Data',
	},

	REMOTE: {
		archive: root+'/Poster Archive',
		data: root+'/Poster Data',
		source: root+'/Approved Posters',
	},
	
	JPEG: {
		dpi: 300,
	},

	SUB: {
		full: 'full',
		thumb: 'thumb',
	},

	THUMBNAIL: {
		width: 211,
		height: 160,
	},
	
	AUTONOMOUS_MODE: {
		idle_timeout_seconds: 60*3,
		poster_duration_seconds: 15,
	},

};