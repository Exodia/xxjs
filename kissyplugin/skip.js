KISSY.add('skip', function(S){
	var D = S.DOM, Event = S.Event;
	
	var Skip = function(el, configs){
		if(!(el = D.get(el))){
			return;
		};
		
		var defaultConfig = {
			step: 1,
			direct:'r'
		};
		
		this._elem = el;
		this._configs = configs = S.merge(defaultConfig, configs);
		this._items = configs.itemType? D.query(configs.itemType) : D.children(el);
		this._current = 0;
		this._end = this._items.length;
		
		el.innerHTML += el.innerHTML;
		
		switch(configs.direct){
			case 'r':
				this._scrollProp = 'scrollLeft';
				this._sizeProp = 'outerWidth';
				this._delta = el.scrollWidth - el.offsetWidth;
				this._factor = 1;
				break;
			case 'l':
				this._scrollProp = 'scrollLeft';
				this._sizeProp = 'outerWidth';
				this._delta = el.scrollWidth - el.offsetWidth;
				this._factor = -1;
				break;
			case 't':
				this._scrollProp = 'scrollTop';
				this._sizeProp = 'outerHeight';
				this._delta = el.scrollHeight - el.offsetHeight;
				this._factor = -1;
				break;
			case 'b':
				this._scrollProp = 'scrollTop';
				this._sizeProp = 'outerHeight';
				this._delta = el.scrollHeight - el.offsetHeight;
				this._factor = 1;
				break;
				
		}
		
		el.style.whiteSpace = 'nowrap';
	};
	
	function _calSkipLength(current, end, step, prop, items){
		var i, length, el;
		i = length = 0;
		while(i < step){
			el = items[++current];
			el && (length += S[prop](el)); 
		}
		
		return length;
	}
	
	Skip.prototype = {
		constructor: Skip,
		next: function(){
			var configs 	= this._configs,
				el 			= this._elem,
				sizeProp 	= this._sizeProp,
				scrollProp  = this._scrollProp,
				step 		= configs.step,
				offset;
				
			if(end <= this._current + step){
				step = (this._current + step) % end;
				this._current = 0;
			}
			
			offset = _calSkipLength(this._current, this._end, step, this._items);
			
				
			
		}
	}
});
