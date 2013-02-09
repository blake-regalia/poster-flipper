(function() {
	var db = {};
	window.Keyboard = function(obj) {
		var code;
		for(var key in obj) {
			if(typeof key === String.type && (code = DOM_VK[key.toUpperCase()])) {
				db[code] = obj[key];
			}
		}
		$(document).keydown(function(e) {
			if(db[e.keyCode]) {
				db[e.keyCode].apply(null, [e]);
			}
		});
	};
})();