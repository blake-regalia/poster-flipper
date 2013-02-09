/** <csx> **/

globalAspectRatio: 4 / 3,
globalTransitionTime: 1.2,

main: {
	position: 'fixed',
	
	width: '100%',
	height: '100%',
	
	left: 0,
	top: 0,
	
	textAlign: 'center',
	
	img: {
		width: '100%',
		height: 'auto',
		
		transition: 'all 0.2s ease-in-out',
		
		userSelect: 'none',
	},
},

scroll: {
	position: 'fixed',
	
	width: '100%',
	height: '180px',
	
	left: 0,
	bottom: 0,
	
	backgroundColor: 'brown',
	
	transition: 'all 1s ease-out',
	
	hidden: {
		bottom: 0-scroll.height,
	},
	
	slider: {
		position: 'absolute',
		
		width: '9999999px',
		height: '100%',
		
		left: 0,
		top: '6px',
		
		bottom: 0,
		
		transition: ['all ',globalTransitionTime,'s cubic-bezier(0,.43,.52,1)',],
	},
	
	title: {
		position: 'fixed',
		
		width: '100%',
		height: '26pt',
		
		bottom: 0,
		
		borderRadius: '2em 2em 0 0',
		
		color: 'white',
		backgroundColor: 'rgba(0,0,0,0.3)',
		
		textAlign: 'center',
		fontFamily: 'verdana',
		
		transition: 'all 1.2s ease-out',
		
		hide: {
			transform: 'translateY(100%)',
		},
		hidden: {
			backgroundColor: 'rgba(0,0,0,0.75)',
		},
	},
},

thumbnail: {
	position: 'relative',
	display: 'inline-block',
	
	height: scroll.height*0.75,
	width: this.height*globalAspectRatio,
	
	top: 0,
	
	$paddingLeftRight: '15px',
	padding: ['0 ',this.$paddingLeftRight,],
	
	verticalAlign: 'top',
	
	transition: ['all ',globalTransitionTime,'s cubic-bezier(0,.43,.52,1)',],
	
	textAlign: 'center',
	
	panel: {
		height: '160px',
		top: 0-scroll.title.height,
		width: 160*globalAspectRatio,
		
		hidden: {
			height: thumbnail.height,
			top: 0,
		},
	},
	
	img: {
		width: 'auto',
		height: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
		
		userSelect: 'none',
	},
	
	span: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
		
		fontFamily: 'arial',
		fontSize: '16pt',
		marginTop: '15%',
		
		left: 0,
		top: 0,
		
		position: 'absolute',
	},
},

/** </csx> **/

#main {
	@main;
}

#main>img {
	@main.img;
}

#scroll {
	@scroll;
}

#scroll>#slider {
	@scroll.slider;
}

#scroll>#title {
	@scroll.title;
}
#scroll>#title.hide {
	@scroll.title.hide;
}

#scroll.hidden {
	@scroll.hidden;
}

#scroll.hidden .panel {
	@thumbnail.panel.hidden;
}

#scroll.hidden>#title {
	@scroll.title.hidden;
}


.thumbnail {
	@thumbnail;
}

.thumbnail.panel {
	@thumbnail.panel;
}

.thumbnail>img {
	@thumbnail.img;
}

.thumbnail>span{
	@thumbnail.span;
}
