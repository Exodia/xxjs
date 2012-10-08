/**
 *范围选取 
 */

void function($){
	var _$mask = null,
		_status = '',
		MOVEINTERVAL = 25,
		startX, startY;
	
	var _createMask = function() {
		if(!_$mask) {
			_$mask = $('<div>').css({
				position: 'absolute',
				zIndex: '9999',
				zoom:'1',
				//filter:'alpha(opacity=50)',
				opacity:0.5,
				backgroundColor:'green',
				width:0,
				height:0
			})
		}
		
		_$mask.appendTo(document.body);
	};
	
	var _disableSelect = function($el) {
		$el.css({
			webkitUserSelect:'none',
			mozUserSelect:'none',
			userSelect:'none'
		});
	}
	
	var eventFns = {
		mousedown: function(ev) {
			_status = 'start';
			_$mask.css({
				top : ev.pageY -2,
				left : ev.pageX -2,
				height: 0,
				width: 0
			});
			$(this).trigger('xxRangeSelect:selectstart', [{x1:ev.pageX, y1:ev.pageY}, _$mask]);
		},
		mousemove:  function(ev) {
			if(!_status) {
				return;
			}
				
			_status = 'move';
			$(this).trigger('xxRangeSelect:select', [{x1:startX, y1:startY, x2:ev.pageX, y2:ev.pageY}, _$mask]);
		},
		mouseup: function(ev) {
			if(!_status || Math.abs(ev.pageX - startX) < 5 || Math.abs(ev.pageY - startY) < 5) {
				_status = '';
				return;
			}
			_status = '';
			$(this).trigger('xxRangeSelect:selectend', [{x1:startX, y1:startY, x2:ev.pageX, y2:ev.pageY},  _$mask]);
		},
		mouseleave: function(ev) {
			$(this).triggerHandler('mouseup');
		},
		
		"xxRangeSelect:selectstart": function(ev, point, $mask) {
			startX = point.x1;
			startY = point.y1;
		},
		
		"xxRangeSelect:select": function(ev, point, $mask) {
			var w = Math.abs(point.x2 - startX),
				h = Math.abs(point.y2 - startY);
			
			if(point.x2 < startX) {
				$mask.css('left', point.x2 + 2);
			}
			
			if(point.y2 < startY) {
				$mask.css('top', point.y2 + 2);
			}
			
			$mask.width(w).height(h);
		}
	};
	
	var commandFns = {
		enable: function() {
			_createMask();
			this.on(eventFns);
			_$mask.on(eventFns);
			_disableSelect(this);  
			 
			return this;
		},
		disable: function() {
			_$mask && _$mask.remove();
			this.off(eventFns);
		
			return this;
		},
		destroy: function() {
			commandFns.disable.call(this);
			_$mask = null;
			
			return this;
		}
	};
	
	$.fn.xxRangeSelect = function(options) {
		options || (options = 'enable');
		
		if(typeof options == 'string') {
			commandFns[options] && commandFns[options].call(this);
		} else {
			
		}

		return this;
		
	};
	
}(jQuery);
