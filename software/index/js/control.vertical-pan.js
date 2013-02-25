/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function(namespace) {
	
	var __func__ = 'VerticalPan';
	
	var instance;
	
	var verticalScrollAmount = 80;
	
	var construct = function() {
		
		/**
		* private:
		**/
		var translateY = 0;
		
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
				translateY += -1 * direction * verticalScrollAmount;
				PosterTransform('translateY',translateY+'px');
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
				translateY = 0;
				PosterTransform('translateY',translateY+'px');
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