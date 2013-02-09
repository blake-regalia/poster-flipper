/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	
	var __func__ = 'Controls';
	
	var instance;
	
	var construct = function(originCaptor, actionKeys, modes) {
	
		actionKeys = actionKeys || [DOM_VK['SPACE']];
		modes = modes || [];
		modes.unshift(originCaptor);
		
		/**
		* private:
		**/
		var modeIndex = -1;
		var captor;
		
		
		var self = {
		
			//
			shiftMode: function() {
				modeIndex = (modeIndex+1) % modes.length;
				captor = modes[modeIndex];
				$('#mode-overlay').removeClass().addClass('mode-'+captor.getClassName());
			},
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
			
		});
		
		
		/**
		* initialize:
		**/
		self.shiftMode();
		
		$(document).bind('mousewheel', function(e) {
			if(e.wheelDelta < 0) {
				captor.scroll(1);
			}
			else {
				captor.scroll(-1);
			}
		});
		
		$(document).bind('keydown', function(e) {
			if(actionKeys.indexOf(e.keyCode || e.which) !== -1)  {
				self.shiftMode();
			}
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var global = window[__func__] = function() {
		if(this !== window) {
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
	});
})();