void function(){
	var XX = {
		
	};
	if(typeof exports == 'object'){
		exprots = XX;
	} else {
		window.XX = XX;
	}
	
	XX.Event = function(){
		this._handlers = {};
	};
	
	/*
	 *监听事件
	 * evt：为string，callback为回调函数，options为对象，包含scope，data两个元素，前者为callback的this上下文，data为要传入的参数
	 * */
	var _onstr = function(evt, callback, options){
		var handlers = null;
		this._handlers[evt] || (this._handlers[evt] = []);
		this._handlers[evt].push({
			fn: callback,
			scope: (options && options.scope) || null,
			data: (options && options.data) || [] 
		});
		
		return this;
	};
	
	/*
	 *监听事件函数
	 * kvp： {
	 * 	type1:{
	 * 		callback:fn,
	 * 		scope: scope,
	 * 		data: data
	 *  },
	 * 	type2:{
	 * 		...
	 * 		...
	 *  }
	 *	...  
	 *}
	 * */
	var _onkvp = function(kvp){
		for(var k in kvp){
			_onstr(k, kvp[k].callback, {
				scope: kvp[k].scope,
				data: kvp[k].data
			})
		}
	}
	
	/*
	 *监听事件
	 * evts：为数组，callback为回调函数，options为对象，包含scope，data两个元素，前者为callback的this上下文，data为要传入的参数
	 * 该函数能够将一系列关联事件合并为一个事件，只有当evts中的所有事件都触发时，callback才会被调用
	 * */
	var _onarr = function(evts, callback, options){
		var _events = {},
			data = [];
		for(var i = evts.length - 1; i > -1; --i){
			_events[evts[i]] = false;
			_onstr(evts[i], _wrapper);
		}
		
		function _wrapper(evt){
			_events[evt] = true;
			data = data.concat(Array.prototype.slice.call(arguments, 1));
			//若事件	
			for(var k in _events){
				if(!_events[k]){
					return;
				}
			}
			
			callback.apply(options.scope || null, data);
		}
		
		_wrapper._cb = callback;
	}
	
	XX.Event.prototype = {
		constructor: XX.Event,
		on: (function(){
			
			
			return function(){
				
			};
		})(),
		off: function(){
			
		}
	}
}();
