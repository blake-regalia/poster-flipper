/** <csx> **/

overlay: {
	position: 'fixed',
	
	width: '360px',
	height: '200px',
	
	right: '10%',
	top: '7%',
	
	color: 'lightBlue',
	fontSize: '32pt',
	textAlign: 'center',
	fontFamily: 'sans-serif,arial,verdana',
	paddingTop: '20px',
	
	backgroundColor: 'rgba(0,26,230,0.7)',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: '50% 75%',
	
	border: '4px solid navy',
	borderRadius: '20px',
	
	opacity: 1,
	
	fadeable: {
		transition: 'all 1s ease-in-out',
	},

	slider: {
		backgroundImage: 'url("resource/mode-slider.png")',
		
		after: {
			content: '"Scroll Posters"',
		},
	},
	
	verticalpan: {
		backgroundImage: 'url("resource/mode-verticalpan.png")',
		
		after: {
			content: '"Pan Vertically"',
		},
	},
	
	horizontalpan: {
		backgroundImage: 'url("resource/mode-horizontalpan.png")',
		
		after: {
			content: '"Pan Horizontally"',
		},
	},
	
	zoom: {
		backgroundImage: 'url("resource/mode-zoom.png")',
		
		after: {
			content: '"Zoom In/Out"',
		},
	},
},

/** </csx> **/

#mode-overlay {
	@overlay;
}
.fadeable {
	@overlay.fadeable;
}

.mode-slider {
	@overlay.slider;
}
.mode-slider:after {
	@overlay.slider.after;
}

.mode-verticalpan {
	@overlay.verticalpan;
}
.mode-verticalpan:after {
	@overlay.verticalpan.after;
}

.mode-horizontalpan {
	@overlay.horizontalpan;
}
.mode-horizontalpan:after {
	@overlay.horizontalpan.after;
}

.mode-zoom {
	@overlay.zoom;
}
.mode-zoom:after {
	@overlay.zoom.after;
}

#mode-overlay.hide {
	opacity: 0;
}