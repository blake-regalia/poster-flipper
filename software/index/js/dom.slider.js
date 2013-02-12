

(function(namespace) {
	
	var __func__ = 'Slider';
	
	var construct = function(db) {
		
		/**
		* private:
		**/
		var posterIndex = 0;
		
		var viewportWidth = $(document).width(),
			viewportHeight = $(document).height()
		
		var viewportCenter = $(document).width() * 0.5,
			previewCenter = (CSS('thumbnail.panel.width').pixels() + CSS('thumbnail.$paddingLeftRight').pixels()) * 0.5,
			thumbnailOuterWidth = CSS('thumbnail.width').pixels() + CSS('thumbnail.$paddingLeftRight').pixels();
		
		var html = '';
		
		var len = db.length, i = -1;
		while(++i !== len) {
			var poster = db[i];
			html += '<div class="thumbnail">'
					+'<img src="'+poster.thumb+'"/>'
				+'</div>'
		}
		
		$('canvas')
			.width(viewportWidth)
			.height(viewportHeight);
		
		var self = {
			dom: $('#slider').html(html),
		};
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
		$.extend(operator, {
			
			// 
			scroll: function(direction) {
				if($('#scroll').is('.hidden')) {
					$('#scroll').removeClass('hidden');
				}
				
				posterIndex += direction;
				if(posterIndex >= $('.thumbnail').length) {
					posterIndex = 0;
				}
				else if(posterIndex < 0) {
					posterIndex = $('.thumbnail').length-1;
				}
				
				$('.panel').removeClass('panel');
				$('.thumbnail').eq(posterIndex).addClass('panel');
				
//				$('#slider').css('left', viewportCenter - posterIndex*thumbnailOuterWidth - previewCenter);

				$('#title').text(db[posterIndex].title);
			},
			
			// 
			select: function() {
				var img = new Image();
				/**
				img.onload = function() {
					$('canvas').get(0).getContext('2d').drawImage(img,0,0,viewportWidth,viewportHeight);
				};
				/**/
				img.src = db[posterIndex].src;
				$('#main').empty().append(img);
				
				$('#scroll').addClass('hidden');
			},
		});
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
	$.extend(global, {
		
		//
		toString: function() {
			return __func__+'()';
		},
		
		//
		error: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		},
		
		//
		warn: function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		},
		
		
		//
		getClassName: function() {
			return __func__.toLowerCase();
		},
	});
})(window);