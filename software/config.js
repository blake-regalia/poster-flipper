
var root = 'D:/HTTP/remote/phys/poster-flipper/remote';

exports.config = {

	LOCAL: {
		data: 'D:/HTTP/remote/phys/poster-flipper/Poster Data',
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