/**

**/
(function(namespace) {
	
	var __func__ = 'EventHandler';
	
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var eventType = {};
		
		/**
		* public operator() ();
		**/
		var operator = function(eventName, fn) {
			
			// reference the event handler and assume it is defined
			var handlerList = eventType[eventName];
			
			// if it is not defined, assign it an empty array
			if(!handlerList) handlerList = eventType[eventName] = [];
			
			// if only the eventName was given
			if(arguments.length === 1) {
				
				// return a callback function handler
				return function() {
					var len = handlerList.length, i = -1;
					while(++i !== len) {
						handlerList[i].apply(this, arguments);
					}
					handlerList.length = 0;
				};
			}
			
			// else a callback function was given, prepend it to the handler lsit
			handlerList.push(fn);
		};
		
		
		/**
		* public:
		**/
		
			
			operator.unbind = function(eventName, fn) {
				var handlerList = eventType[eventName];
				if(!handlerList) return;
				
				var i = handlerList.length;
				if(fn) {
					var i = handlerList.indexOf(fn);
					handlerList.splice(i, 1);
				}
				else {
					handlerList.length = 0;
				}
				return;
			};
		
		
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
		
		//
		global.toString = function() {
			return __func__+'()';
		};
		
		//
		global.error = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		global.warn = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(window);