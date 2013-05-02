

(function(namespace) {
	
	var __func__ = 'Slider';
	var instance;
	var eventHandler = new EventHandler();
	
	var titleVisibleDuration = 3600;
	var panelVisibleDuration = 5000;

	var DF_POSTER_INDEX = 0;
	
	var infiniteCycle = false;
	
	var construct = function(db) {
		
		/**
		* private:
		**/
		var image;
		var posterIndex = DF_POSTER_INDEX;
		var selected = -1;
		
		var cwd = db;
		var up = [cwd];
		
		var timeoutTitle = 0;
		var timeoutScroll = 0;
		
		var viewportWidth = $(window).width(),
			viewportHeight = $(window).height()
		
		var viewportCenter = $(document).width() * 0.5,
			thumbnailOuterWidth = CSS('thumbnail.block.width').pixels() + 2*CSS('thumbnail.padding-sides').pixels(),
			previewCenter = (thumbnailOuterWidth * 0.5);
			
		console.log(viewportCenter);
		console.log(previewCenter);
		
		var gen = function() {
			var html = '';
			// var html = '<div class="thumbnail directory" fileIndex="-1"><img src="resource/directory.up.png"/></div>';
		
			var files = cwd.files;
			for(var i=0; i<files.length; i++) {
				var file = files[i];
				html += '<div class="thumbnail'+(file.type=='dir'? ' directory':'')+'" fileIndex="'+i+'">'
					+'<img src="'+file.thumb+'"/>'
					+(file.type=='dir'?'<span>'+file.name+'</span>':'')
				+'</div>'
			}
			
			return html;
		}
		
		var cd = function(findex) {
			if(findex == DF_POSTER_INDEX) {
				cwd = up.pop();
				if(!up.length) up.push(cwd);
			}
			else {
				up.push(cwd);
				cwd = cwd.files[findex];
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
				swfPath: '/resource/',
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
			
			operator['scroll'] = function(direction, roundabout) {
				// don't let the title dissapear while we're scrolling through posters
				clearTimeout(timeoutTitle);
				$('#title').removeClass('hide');
				
				// nor the panel
				clearTimeout(timeoutScroll);
				$('#scroll').removeClass('hidden');

				var thumbnail_length = $('.thumbnail').length+DF_POSTER_INDEX;
				
				posterIndex += direction;
				if(posterIndex >= thumbnail_length) {
					if(infiniteCycle || roundabout) {
						posterIndex = DF_POSTER_INDEX;
					}
					else {
						posterIndex = thumbnail_length-1;
						return;
					}
				}
				else if(posterIndex < DF_POSTER_INDEX) {
					if(infiniteCycle || roundabout) {
						posterIndex = thumbnail_length-1;
					}
					else {
						posterIndex = DF_POSTER_INDEX;
						return;
					}
				}
				
				$('.panel').removeClass('panel');
				
				var elmt = $('.thumbnail').eq(posterIndex).get(0);
				$(elmt).addClass('panel');
				
				$('#slider').css('left', viewportCenter - (posterIndex-DF_POSTER_INDEX)*thumbnailOuterWidth - previewCenter);

				var findex = $(elmt).attr('fileIndex');
				if(findex == DF_POSTER_INDEX) {
					$('#title').text('');
				}
				else {
					var file = cwd.files[findex];
					$('#title').text(file.title || file.name);
				}
				
				timeoutScroll = setTimeout(function() {
					operator.hidePanel();
				}, panelVisibleDuration);
				
				return (file && file.type) || true;
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
					var file = cwd.files[findex] || {type:'dir'};
					
					if(file.type == 'dir') {
						$('#slider').html(
							cd(findex)
						);
						posterIndex = DF_POSTER_INDEX;
						operator.scroll(0);
						return true;
					}
					else {
						selected = posterIndex;
						switch(file.type) {
						case 'image':
							$('#poster').show();
							$('#poster').attr('src', file.src);
							$('#video').jPlayer('destroy');
							break;
							
						case 'video':
							$('#poster').hide();
							$('#video').jPlayer('destroy');
								
							var fsrc = file.src;
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
							
							console.log(fsrc);
							
							$('#video')
								.jPlayer(
									jPlayerConstructor(type, '/'+fsrc)
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