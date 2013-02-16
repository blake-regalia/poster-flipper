$(document).ready(function() {
	
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
	
	/**/
	
	new Controls(Slider, [DOM_VK['SPACE'], DOM_VK['RETURN']], [VerticalPan]);
	
	$(document).bind('mousewheel', function(e) {
		console.log(e);
		if(e.wheelDelta < 0) {
			Slider().scroll(1);
		}
		else {
			Slider().scroll(-1);
		}
	});
	/**/
	
	$.getJSON('/get-posters.json', function(json) {
		new Slider(json);
	});
	
});