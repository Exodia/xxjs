KISSY.add('skip', function(S){
	var D = S.DOM, Event = S.Event;
	
	var Skip = function(el, configs){
		if(!(el = D.get(el))){
			return;
		};
		
		var defaultConfig = {
			step: 1,
			direct:'x',
			startIndex: 0
		};
		
		this._elem = el;
		this._configs = configs = S.merge(defaultConfig, configs);
		this._items = configs.itemType? D.query(configs.itemType) : D.children(el);
		this._current = configs.startIndex;
		configs.endIndex = configs.endIndex || this._items.length - 1;
		
		el.innerHTML += el.innerHTML;
		
		switch(configs.direct){
			case 'x':
				this._scrollProp = 'scrollLeft';
				this._sizeProp = 'outerWidth';
				this._size = el.scrollWidth;
				break;
			case 'y':
				this._scrollProp = 'scrollTop';
				this._sizeProp = 'outerHeight';
				this._size = el.scrollHeight;
				break;
		}
		
		el.style.whiteSpace = 'nowrap';
	};
	
	function _getLength(index, prop, items){
		return D[prop](items[index], true);
	}
	
	
	Skip.prototype = {
		constructor: Skip,
		go: function(num){
			num = num || 1;
			var factor = num < 0 ? -1 : 1;
			num = Math.abs(num);
			
			var configs 	= this._configs,
				el 			= this._elem,
				sizeProp 	= this._sizeProp,
				scrollProp  = this._scrollProp,
				size       = this._size,
				step 		= configs.step * num,
				i           = 0,
				scroll      = el[scrollProp],
				end         = configs.endIndex + 1,
				offset;
				
			while(i < step){
				this._current = (++this._current) % end;
				offset = _getLength(this._current, sizeProp, this._items) * factor;
				if(factor === 1){
					if(scroll  <  size){
						scroll += offset;
					} else {
						scroll = 0;
					}
				} else {
					if(scroll  >  0){
						scroll += offset;
					} else {
						scroll = 0;
					}
				}
				
			}
			
			el[scrollProp] = scroll;	
			
		},
		next: function(){
			this.go();		
		},
		prev: function(){
			this.go(-1);
		},
		destroy: function(){
			this._items = null;
			this._elem = null;
		}
	}
	
	return Skip;
});
