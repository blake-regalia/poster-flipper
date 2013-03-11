
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

};