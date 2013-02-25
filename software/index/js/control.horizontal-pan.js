/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function(namespace) {
	
	var __func__ = 'HorizontalPan';
	
	var instance;
	
	var horizontalScrollAmount = 20;
	
	var construct = function() {
		
		/**
		* private:
		**/
		var translateX = 0;
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			
			// 
			operator['scroll'] = function(direction) {
				translateX += -1 * direction * horizontalScrollAmount;
				PosterTransform('translateX',translateX+'px');
			};
			
			//
			operator['select'] = function() {
				return false;
			};
			
			//
			operator['getClassName'] = function() {
				return __func__.toLowerCase();
			};
			
			//
			operator['reset'] = function() {
				translateX = 0;
				PosterTransform('translateX',translateX+'px');
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = namespace[__func__] = function() {
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
	
		//
		expose['reset'] = function() {
			return (instance && instance.reset());
		};
		
		
		//
		expose['toString'] = function() {
			return __func__+'()';
		};
		
		//
		expose['error'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		expose['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(window);