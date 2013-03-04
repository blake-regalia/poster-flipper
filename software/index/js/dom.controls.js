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
		
		var fadeoutTimer = 0;
		
		var self = {
		
			//
			shiftMode: function() {
				$('#mode-overlay').removeClass();
				
				if(captor && captor.close) captor.close();
				
				modeIndex = (modeIndex+1) % modes.length;
				captor = modes[modeIndex];
				
				if(captor.open) captor.open();
				
				setTimeout(function() {
					$('#mode-overlay').addClass('mode-'+captor.getClassName()).addClass('fadeable');
					
					clearTimeout(fadeoutTimer);
					fadeoutTimer = setTimeout(function() {
						$('#mode-overlay').addClass('hide');
					}, 1200);
				}, 20);
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
			operator[''] = function() {

			};
		
		
		/**
		* initialize:
		**/
		self.shiftMode();
		
		var wheelHandler = function(e) {
			// console.log(e);
			var wheelDelta = e.wheelDelta? e.wheelDelta: e.detail;
			// console.log(wheelDelta);
			if(wheelDelta < 0) {
				captor.scroll(1);
			}
			else {
				captor.scroll(-1);
			}
		};
		
		$(document).bind('DOMMouseScroll', wheelHandler);
		$(document).bind('mousewheel', wheelHandler);
		
		$(document).bind('keydown', function(e) {
			if(actionKeys.indexOf(e.keyCode || e.which) !== -1)  {
				if(!captor.select()) {
					self.shiftMode();
				}
			}
		});
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var expose = window[__func__] = function() {
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

})();