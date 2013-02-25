$(document).ready(function() {
	
	/*
	Keyboard({
		'right': function() {
			Slider().scroll(1);
		},
		'left': function() {
			Slider().scroll(-1);
		},
		'space': function() {
			Slider().select();
		},
		'up': function() {
			Slider().zoom(1);
		},
		'down': function() {
			Slider().zoom(-1);
		},
	});
	*/
	
	/**/
	
	$.getJSON('./server/get-posters.json', function(json) {
		new Controls(
			new Slider(json),
			[ DOM_VK['SPACE'], DOM_VK['RETURN'] ],
			[ new VerticalPan(), new HorizontalPan(), new Zoom() ]
		);
		/**/
	});
	
});