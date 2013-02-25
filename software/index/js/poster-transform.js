/*!
 * Author: Blake Regalia - blake.regalia@gmail.com
 *
 * Copyright 2012 Blake Regalia
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function(namespace) {
	    
	var __func__ = 'PosterTransform';
	
	var attrs = {};
	
	/**
	* public static operator() ()
	**/
	var global = namespace[__func__] = function(attr, val, dns) {
		if(dns) {
			set = $.extend({}, attrs);
		}
		else {
			set = attrs;
		}
		
		set[attr] = val;
		
		var b = [];
		for(var e in set) {
			b.push(e+'('+set[e]+')');
		}
		
		var transform = b.join(' ');
		console.log(transform);
		$('#poster').css({
			'-moz-transform': transform,
			'-webkit-transform': transform,
			'transform': transform,
		});
	};
	
	
	/**
	* public static:
	**/
	$.extend(global, {
	
		setTemp: function(list) {
			var set = $.extend({}, attrs);
			for(var e in list) {
				set[e] = list[e];
			}
			var b = [];
			for(var e in set) {
				b.push(e+'('+set[e]+')');
			}
			var transform = b.join(' ');
			console.log(transform);
			$('#poster').css({
				'-moz-transform': transform,
				'-webkit-transform': transform,
				'transform': transform,
			});
		},
		
		//
		val: function(attr) {
			return parseFloat(attrs[attr]);
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