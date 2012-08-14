void function(){
	
	function _each(arr, fn, scope){
		for(var i = 0, len = arr.length; i < len; ++i){
			fn.apply(scope || arr, [arr[i], i, arr]);
		}
	}
	
	var slice = Array.prototype.slice;
	
	var XX = {
		
	};
	if(typeof exports == 'object'){
		exprots = XX;
	} else {
		window.XX = XX;
	}
	
	XX.Event = function(){
		this._handlers = {};
		this._all = null;
	};
	
	/*
	 *监听事件
	 * evts：为string，callback为回调函数，scope为callback的this上下文，data为要传入的参数数组
	 * */
	var _onstr = function(evts, callback, scope, data) {
		var handlers = this._handlers,
			handler = null;
		_each(evts.split(' '), function(evt, index){
			(handler = handlers[evt]) || (handler = handlers[evt] = []);
			handler.push({
				fn : callback,
				scope : scope || null,
				data : data || []
			});
		}, this);

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
	 * evtList：为数组，callback为回调函数，scope为callback的this上下文，data为要传入的参数数组
	 * 该函数能够将一系列关联事件合并为一个事件，只有当evts中的所有事件都触发时，callback才会被调用
	 * */
	var _onall = function(evtList, callback, scope, data){
		var _events = {},
			_data = (data && data.slice(0)) || [];
		for(var i = evtList.length - 1; i > -1; --i){
			var evts = evtList.split(' ');
			for(var j = evts.length - 1; j > -1; --j){
				_events[evts[i]] = false;
				_onstr(evts[i], _wrapper, null, [evts[i]]);
			}
		}
		
		function _wrapper(evt){
			_events[evt] = true;
			_data = _data.concat(Array.prototype.slice.call(arguments, 1));
			//若事件	
			for(var k in _events){
				if(!_events[k]){
					return;
				}
			}
			
			callback.apply(options.scope || null, _data);
		}
		
		_wrapper.__fn = callback;
	};
	
	/*
	 *在事件每发生count次后，触发callback
	 * */
	var _count = function(count, evts, callback, scope, data){
		if(count < 0){
			return;
		}
		var self = this,
			_count = count;
		var _originData = (data && data.slice(0)) || [],
			_data = _originData.slice(0);
		var _wrapper = function(){
			--_count;
			_data.concat(Array.prototype.slice.call(arguments, 0));
			if(_count === 0){
				_count = count;
				callback.apply(scope, _data);
				_data =  _originData.slice(0);
			}
		};
		
		_wrapper.__fn = callback;
		_onstr(evts, _wrapper, scope);
	};
	
	/*
	 *事件触发函数
	 * evts为以空格分隔的字符串
	 * 第一个参数之后的参数将传入事件监听函数
	 * 如：fire("event1 event2 event3") 将会依次触发event1，event2，event3事件
	 * 若 !evts为true，则等价于调用fireAll
	 * */
	var _fire = function(evts){
		var handlers = this._handlers,
			handler = null,
			data = slice.call(arguments, 1);
			all =  handlers['all'];
			
		if(!evts){
			this.fireAll(data);
		}
		_each(evts.split(' '), function(evt){
			handlers[evt] && _each(handlers[evt], function(handler){
				handler.fn.apply(handler.scope, [evt].concat(handler.data).concat(data));
				if(evt !== 'all' && all){
					_each(all, function(handler){
						handler.fn.apply(handler.scope, [evt].concat(handler.data).concat(data));
					})
				}
			}, this);
		}, this)
		
		return this;
	};
	
	
	/*
	 *触发全部事件,并将参数传入事件监听函数
	 * */
	var _fireAll = function(){
		var handlers = this._handlers,
			k;
		for(k in handlers){
			this.fire.apply(this, [k].concat(slice.call(arguments, 0)));
		}
		
		return this;
	};
	
	var _off = function(evts, callback){
		var handlers = this._handlers;
		if(arguments.length == 0){
			this._handlers = {};
		} else if(typeof evts === 'function') {
			for(var k in handlers){
				_each(handlers[k], function(handler, index){
					(handler.fn == evts || handler.fn.__fn == evts) && (this[index] = null); 
				});
			}
		} else if(typeof evts === 'string'){
			if(typeof callback !== 'function'){
				_each(evts.split(' '), function(evt){
					delete handlers[evt];	
				});
			} else {
				_each(evts.split(' '), function(evt){
					_each(handlers[evt], function(handler, index){
						(handler.fn == callback || handler.fn.__fn == callback) && (this[index] = null); 
					});
				});
			}
		}
	};
	
	XX.Event.prototype = {
		constructor: XX.Event,
		on:_onstr,
		fire:_fire,
		fireAll:_fireAll,
		off: _off
	}
}();
