/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function(namespace) {
	
	var __func__ = 'Zoom';
	
	var instance;
	
	var zoomAmount = 0.1;
	
	var maxScale = 10;
	var minScale = 0.1;
	
	var construct = function() {
		
		/**
		* private:
		**/
		var scale = 1;
		
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
				scale *= 1+direction*zoomAmount;
				if(scale < minScale) scale = minScale;
				else if(scale > maxScale) scale = maxScale;
				
				PosterTransform('scale', scale);
				PosterTransform.setTemp({
					translateX: (PosterTransform.val('translateX')*scale)+'px',
					translateY: (PosterTransform.val('translateY')*scale)+'px',
				}, true);
			},
			
			//
			select: function() {
				return false;
			},
			
			//
			getClassName: function() {
				return __func__.toLowerCase();
			},
			
			//
			reset: function() {
				scale = 1;
				PosterTransform('scale',scale);
			},
			
			//
			open: function() {
				console.warn('opening zoom tool');
				PosterTransform('translateX', (PosterTransform.val('translateX')/scale)+'px');
				PosterTransform('translateY', (PosterTransform.val('translateY')/scale)+'px');
			},
			
			//
			close: function() {
				console.warn('closing zoom tool');
				PosterTransform('translateX', (PosterTransform.val('translateX')*scale)+'px');
				PosterTransform('translateY', (PosterTransform.val('translateY')*scale)+'px');
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
	
	
	var getPosterCenter = function() {
		
	};
	
	
	/**
	* public static:
	**/
	$.extend(global, {
	
		//
		reset: function() {
			return (instance && instance.reset());
		},
		
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
		
	});
})(window);