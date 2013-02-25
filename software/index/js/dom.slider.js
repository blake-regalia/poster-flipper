

(function(namespace) {
	
	var __func__ = 'Slider';
	var instance;
	var eventHandler = new EventHandler();
	
	var titleVisibleDuration = 3600;
	var panelVisibleDuration = 5000;
	
	var infiniteCycle = false;
	
	var construct = function(db) {
		
		/**
		* private:
		**/
		var image;
		var posterIndex = 0;
		var selected = -1;
		
		var cwd = db;
		var up = [cwd];
		
		var timeoutTitle = 0;
		var timeoutScroll = 0;
		
		var viewportWidth = $(window).width(),
			viewportHeight = $(window).height()
		
		var viewportCenter = $(document).width() * 0.5,
			previewCenter = (CSS('thumbnail.block.$.panel.width').pixels() + CSS('thumbnail.padding-sides').pixels()) * 0.5,
			thumbnailOuterWidth = CSS('thumbnail.block.$.panel.width').pixels() + 2*CSS('thumbnail.padding-sides').pixels();
		
		var gen = function() {
			var html = '<div class="thumbnail directory" file=".."><img src="resource/directory.up.png"/></div>';
		
			console.log(cwd);	
			var files = cwd.files;
			for(var i=files.length-1; i>=0; i--) {
				var file = files[i];
				html += '<div class="thumbnail'+(file.type=='dir'? ' directory':'')+'" file="'+(file.name || file.title)+'" index="'+i+'">'
					+'<img src="'+file.thumb+'"/>'
					+(file.type=='dir'?'<span>'+file.name+'</span>':'')
				+'</div>'
			}
			
			return html;
		}
		
		var cd = function(path) {
			if(path == '..') {
				cwd = up.pop();
				if(!up.length) up.push(cwd);
			}
			else {
				up.push(cwd);
				cwd = cwd[path];
			}
			
			return gen();
		}
		
		$('canvas')
			.width(viewportWidth)
			.height(viewportHeight);
		
		var self = {
			dom: $('#slider').html(
				gen()
			),
		};
		
		// jPlayer init
		jPlayerConstructor = function(type, src) {
			var media = {};
			media[type] = src;
			return {
				ready: function() {
					$(this)
						.jPlayer('setMedia', media)
						.jPlayer('play');
				},
				size: {
					width: '100%',
					height: '100%',
				},
				swfPath: RESOURCE_PATH_JPLAYER,
				solution: 'html,flash',
				supplied: type,
			};
		};
		
		
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
				// don't let the title dissapear while we're scrolling through posters
				clearTimeout(timeoutTitle);
				$('#title').removeClass('hide');
				
				// nor the panel
				clearTimeout(timeoutScroll);
				$('#scroll').removeClass('hidden');
				
				posterIndex += direction;
				if(posterIndex >= $('.thumbnail').length) {
					if(infiniteCycle) {
						posterIndex = 0;
					}
					else {
						posterIndex = $('.thumbnail').length-1;
						return;
					}
				}
				else if(posterIndex < 0) {
					if(infiniteCycle) {
						posterIndex = $('.thumbnail').length-1;
					}
					else {
						posterIndex = 0;
						return;
					}
				}
				
				$('.panel').removeClass('panel');
				
				var elmt = $('.thumbnail').eq(posterIndex).get(0);
				$(elmt).addClass('panel');
				
				$('#slider').css('left', viewportCenter - posterIndex*thumbnailOuterWidth - previewCenter);

				var findex = $(elmt).attr('fileIndex') || 0;
				var file = cwd.files[findex];
				$('#title').text(file.title || file.name);
				
				timeoutScroll = setTimeout(function() {
					operator.hidePanel();
					
				}, panelVisibleDuration);
			};
			
			//
			operator['hidePanel'] = function() {
				$('#scroll').addClass('hidden');
					
				timeoutTitle = setTimeout(function() {
					$('#title').addClass('hide');
				}, titleVisibleDuration);
			};
			
			// 
			operator['select'] = function() {
				if($('#scroll').is('.hidden')) {
					return false;
				}
				
				if(posterIndex == selected) {
					operator.hidePanel();
					return false;
				}
				else {
					VerticalPan.reset();
					HorizontalPan.reset();
					Zoom.reset();
					
					var elmt = $('.thumbnail').eq(posterIndex);
					var findex = $(elmt).attr('fileIndex');
					var file = cwd.files[findex];
					
					if(file.type == 'dir') {
						$('#slider').html(
							cd(fname)
						);
						posterIndex = 0;
						operator.scroll(0);
						return true;
					}
					else {
						selected = posterIndex;
						switch(file[':type']) {
						case 'image':
							$('#poster').show();
							$('#poster').attr('src', file[':src']);
							$('#video').jPlayer('destroy');
							break;
							
						case 'video':
							$('#poster').hide();
							$('#video').jPlayer('destroy');
								
							var fsrc = file[':src'];
							var type = '';
							(function() {
								var ext = fsrc.substr(fsrc.lastIndexOf('.')+1);
								switch(ext) {
								case 'ogg':
									type = 'ogv'; break;
								case 'webm':
									type = 'webmv'; break;
								case 'mp4':
									type = 'm4v'; break;
								default: // flv
									type = ext; break;
								}
							})();
							
							$('#video')
								.jPlayer(
									jPlayerConstructor(type, ABSOLUTE_ROOT_PATH+'/'+fsrc)
								);
							break;
						}
						operator.hidePanel();
						return true;
					}
				}
			};
			
			operator['getImage'] = function() {
				return image;
			};
		
			//
			operator['getClassName'] = function() {
				return __func__.toLowerCase();
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
		
		expose['ready'] = function(fn) {
			if(!fn) {
				eventHandler('ready')();
			}
			else {
				eventHandler('ready', fn);
			}
		};

})(window);