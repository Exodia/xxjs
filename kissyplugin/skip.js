KISSY.add('aitiaoskip', function(S){
	var D = S.DOM, Event = S.Event;
	
	var Skip = function(el, configs){
		if(!(el = D.get(el))){
			return;
		};
		
		var defaultConfig = {
			step: 1,
			direct:'x',
			startIndex: 0,
			moveByOffset:true
		};
		
		
		this._elem = el;
		this._configs = configs = S.merge(defaultConfig, configs || {});
		this._current = configs.startIndex;
		
		switch(configs.direct){
			case 'x':
				this._scrollProp = 'scrollLeft';
				this._sizeProp = 'outerWidth';
				this._offsetProp = 'offsetLeft';
				this._size = el.scrollWidth;
				break;
			case 'y':
				this._scrollProp = 'scrollTop';
				this._sizeProp = 'outerHeight';
				this._offsetProp = 'offsetTop';
				this._size = el.scrollHeight;
				break;
		}
		
		el.innerHTML += el.innerHTML;
		this._items = configs.itemType? D.query(configs.itemType) : D.children(el);
		this._items = this._items.slice(0, this._items.length/2);
		configs.endIndex = configs.endIndex || this._items.length - 1;
		
		el.style.whiteSpace = 'nowrap';
	};
	
	function _getLength(index, prop, items, isOffset){
		return isOffset? (D.next(items[index])[prop] - items[index][prop]) : D[prop](items[index], true);
	}
	
	
	Skip.prototype = {
		constructor: Skip,
		go: function(num){
			num = num || 1;
			var factor = num < 0 ? -1 : 1;
			num = Math.abs(num);
			
			var configs 	= this._configs,
				el 			= this._elem,
				moveProp 	= configs.moveByOffset? this._offsetProp : this._sizeProp,
				scrollProp  = this._scrollProp,
				size       = this._size,
				step 		= configs.step * num,
				i           = 0,
				scroll      = el[scrollProp],
				end         = configs.endIndex + 1,
				offset;
				
			while(i++ < step){				
				if(factor === 1){
					offset = _getLength(this._current++, moveProp, this._items, configs.moveByOffset) * factor;
					this._current = this._current % end;
					
					//console.log(offset)
					if(scroll  <  size){
						scroll += offset;
					} else {
						scroll = configs.moveByOffset? offset : 0;
					}
				} else {
					offset = _getLength(this._current--, moveProp, this._items, configs.moveByOffset) * factor;
					this._current < 0 && (this._current = configs.endIndex);
					if(scroll  >  0){
						scroll += offset;
					} else {
						scroll = configs.moveByOffset? size + offset : size;
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
	};
	
	return Skip;
});
