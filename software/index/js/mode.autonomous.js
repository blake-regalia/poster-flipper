/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {
	
	var __func__ = 'Autonomous';
	
	var idler;
	var nexter;
	var idling = false;
	
	var idleMode = function() {
		if(!idling) return;
		Controls().advance();
		nexter = setTimeout(idleMode, Config.AUTONOMOUS_MODE.poster_duration_seconds*1000);
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
	
	expose['wake'] = function() {
		console.log('wake');
		idling = false;
		clearTimeout(nexter);
		clearTimeout(idler);
		idler = setTimeout(function() {
			idling = true;
			idleMode();
		}, Config.AUTONOMOUS_MODE.idle_timeout_seconds*1000);
	};
	
})();