/*
 * 自运行函数，用于创建XMLHttpRequest方法
 **/
void function() {
	//存在原生的XHR，直接返回
	if ( typeof XMLHttpRequest !== 'undefined') {
		return;
	} else if ( typeof ActiveXObject !== 'undefined') {//否则判断ActiveXObject
		XMLHttpRequest = function() {
			if ( typeof arguments.callee.activeXString !== 'string') {
				var versions = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
				for (var i = 0, len = versions.length; i < len; ++i) {
					try {
						var xhr = new ActiveXObject(versions[i]);
						arguments.callee.activeXString = versions[i];
						return xhr;
					} catch(ex) {

					}
				}
			}

			return new ActiveXObject(arguments.callee.activeXString);
		};
	} else {
		XMLHttpRequest = function() {
			throw new Error('No XHR object available');
		};
	}
}();

/*
 * 自运行函数，用于创建$方法，从而支持链式调用
 * 仅为学习和模拟JQ的用法，目前并未完善selector，有待以后完善
 **/

/*void function(){
 //私有构造器，用于包装集合元素
 function _$(els){
 this.elems = [];
 for (var i = 0, len = els.length; i < len; ++i) {
 if ('string' === typeof els[i]) { //传入字符串
 if ('#' === els[i].charAt(0)) { //传入ID
 var elem = doucment.getElementById(els[i]);
 if (elem) {
 this.elems.push(elem);
 }
 }
 else
 if ('.' === els[i].charAt(0)) {//传入class
 this.elems = this.elems.concat(XX.getElementsByClassName(els[i]));
 }
 else { //传入标签
 var tagElems = document.getElementsByTagName(els[i]);
 for (var j = 0, tagLen = tagElems.length; j < tagLen; ++j) {
 this.elems.push(tagElems[j]);
 }
 }
 }
 else
 if (1 === els.nodeType) { //传入标签元素
 elems.push(els[i]);
 }
 }
 }

 _$.prototype = {
 each:function(fn, scope){
 for(var i = 0, len = this.elems.length; i < len; ++i){
 fn.call(scope||this, this.elems[i]);
 }
 return this;
 },
 setStyle:function(prop, value){
 this.each(function(elem){
 elem.style[prop] = value;
 });

 return this;
 },
 show:function(){
 this.each(function(elem){
 elem.style.display = 'block';
 });

 return this;
 }
 };

 //公共接口$
 window.$ = function(){
 return new _$(arguments);
 };
 }(); */

void function() {
	var splice = Array.prototype.splice, slice = Array.prototype.slice;

	/*
	 * 全局对象，XX命名空间
	 **/
	window.XX = window.XX || {};

	/*
	 * 创建命名空间函数
	 * 传入字符串形式：'XX.aa.bb.cc'
	 **/
	XX.namespace = function(ns) {
		if ( typeof ns !== 'string') {
			throw new Error('namespace must be a string');
		}

		var ns_arr = ns.split('.'), s = ns_arr[0], pre_s, i = 1;

		window[s] = window[s] || {};
		pre_s = window[s];

		for ( len = ns_arr.length; i < len; ++i) {
			s = ns_arr[i];
			pre_s[s] = pre_s[s] || {};
			pre_s = pre_s[s];
		}
	};

	/*解析JSON格式字符串*/
	XX.parseJSON = function(str) {
		if (window.JSON) {
			return window.JSON.parse(str);
		} else {
			return (new Function("return " + str))();
		}
	};

	/*
	 *将对象序列化为字符串
	 **/
	XX.stringifyJSON = function(obj) {
		if (!obj) {
			return 'null';
		}
		if (window.JSON) {
			return window.JSON.stringifyJSON(obj);
		} else {
			switch(obj.constructor) {
				case String:
					return '"' + obj + '"';
				case Number:
					return obj.toString();
				case Boolean:
					return obj.toString;
				case Array:
					var buf = [];
					for (var i = 0, len = obj.length; i < len; ++i) {
						buf.push(XX.stringifyJSON(obj[i]));
					}
					return '[' + buf.join(',') + ',';
				case Object:
					var buf = [];
					for (var k in buf) {
						buf.push(k + ':' + XX.stringifyJSON(buf[k]));
					}
					return '{' + buf.join(',') + '}';
				default:
					return 'null'
			}
		}
	}
	//表单数据序列化，支持两种不同的对象：
	//-表单输入元素的数组
	//-键/值对的散列表
	//返回串行化后的字符串
	XX.serialize = function(a) {
		var s = [];
		if ( a instanceof Array) {
			for (var i = 0, len = a.length; i < len; ++i) {
				s.push(a[i].name + '=' + encodeURIComponent(a[i].value));
			};
		} else {
			for (var k in a) {
				s.push(k + '=' + encodeURIComponent(a[k]));
			}
		}

		return s.join('&');
	};
	//一个封装好的ajax对象
	XX.ajax = XX.ajax || {};
	//检查服务器HTTP响应的成功状态
	XX.ajax.httpSuccess = function(xhr) {
		return xhr.status >= 200 && xhr.status < 300 || xhr.status == 304;
	};
	//发起一个ajax请求，opt为传入的设置参数对象
	XX.ajax.request = function(opt) {
		//如果没有提供某个选项的值，就用默认值代替
		opt = {
			//请求方法
			method : opt.method || "POST",
			//请求的URL
			url : opt.url || "",
			//请求超时的时间
			timeout : opt.timeout || 5000,
			//请求失败、成功或完成（不管成功还是失败都会调用）时执行的函数
			complete : opt.complete ||
			function() {
			},
			error : opt.error ||
			function() {
			},
			success : opt.success ||
			function() {
			},
			//发送的请求参数
			params : opt.params || ""
		};

		var xhr = new XMLHttpRequest(), //创建xhr对象
		timeout = opt.timeout, //保存超时时间，默认5秒
		requestDone = false, //标志请求是否完成
		params = XX.serialize(opt.params);
		//GET请求的话则将参数序列化接到url后面

		if (params !== '' && opt.method === 'GET') {
			params = '?' + params;
			opt.url += params;
		}
		//初始化xhr
		xhr.open(opt.method, opt.url, true);

		//初始化一个5秒的回调函数，用于取消请求（如果尚未完成的话）
		setTimeout(function() {
			requestDone = true;
		}, timeout);

		//监听文档状态的更新
		xhr.onreadystatechange = function() {
			//保持等待，直到数据完全加载，并保证请求未超时
			if (xhr.readyState == 4 && !requestDone) {
				if (XX.ajax.httpSuccess(xhr)) {
					//成功则调用回调函数，并传入xhr对象
					opt.success(xhr, xhr.responseText)
				} else {
					//发生错误
					opt.error();
				}

				//调用完成回调函数
				opt.complete();

				//避免内存泄漏，清理文档
				xhr = null;
			}
		};

		if (opt.method === 'POST') {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(params);
			//若为POST请求，则需序列化数据
		} else {
			xhr.send(null);
		}
	};

	/*
	 *去除字符串左边空白
	 * */
	XX.trimLeft = function(str) {
		return str.replace(/^\s+/, '');
	};

	/*去除字符串右边空白*/
	XX.trimRight = function(str) {
		for (var i = str.length - 1; i > -1 && /\s/.test(str.charAt(i)); --i)
		;

		if (i > -1) {
			return str.substr(0, i + 1);
		}
		return '';
	};

	/*去除字符串两端空白*/
	XX.trim = function(str) {
		return XX.trimRight(XX.trimLeft(str));
	};

	/*
	 *判断obj是否为类数组对象
	 * */
	XX.isArrayLike = function(obj) {
		return typeof obj === 'object' && typeof obj.length === 'number';
	};

	/*
	 *Class命名空间
	 **/
	XX.Class = XX.Class || {};

	/*
	 *继承函数
	 *示例：
	 *function super(a){
	 this.a = a;
	 }
	 super.prototype.say = function(){
	 alert(this.a);
	 };

	 function sub(a, b){
	 sub.superClass.call(this);
	 this.b = b;
	 }
	 XX.Class.extend(sub, super);
	 */
	XX.Class.extend = function(subClass, superClass) {
		if ( typeof subClass !== 'function') {
			throw new Error('fatal error:"XX.Class.extend" expects "subClass" a function');
		}
		//类式继承
		if ( typeof superClass === 'function') {
			//创建一个中间函数对象以获取父类的原型对象
			var F = function() {
			};
			//设置原型对象
			F.prototype = superClass.prototype;
			//实例化F, 继承父类的原型中的属性和方法，而无需调用父类的构造函数实例化无关的父类成员
			subClass.prototype = new F();
			//设置构造函数指向子类
			subClass.prototype.constructor = subClass;
			//同时，添加一个指向父类构造函数的引用，方便调用父类方法或者调用父类构造函数
			subClass.superClass = superClass;
			//方法的扩充
		} else if ( typeof superClass === 'object') {
			subClass.prototype = superClass;
			subClass.constructor = this;
		} else {
			throw new Error('fatal error:"XX.Class.extend" expects "superClass" a function or object');
		}

		return subClass;

	};

	/*方法扩充
	 *将src对象中的方法复制到des对象中
	 * */
	XX.Class.mixin = function(des, src) {
		for (var k in src) {
			if (!( k in des)) {
				des[k] = src[k];
			}
		}
	};
	/*短引用*/
	XX.extend = XX.Class.extend;
	XX.mixin = XX.Class.mixin;

	/*一些数组操作功能*/

	XX.Array = XX.Array || {
		/*顺序查找，返回给定元素在数组中首次出现的位置，若不在数组中返回-1*/
		indexOf : function(arr, el, start) {
			if ( typeof arr.indexOf === 'function') {
				return arr.indexOf(el, start);
			}

			for ( start = start || 0, len = arr.length; start < len; ++start) {
				if (arr[start] === el) {
					return start;
				}
			}

			return -1;
		},
		/*逆序查找，返回给定元素在数组中首次出现的位置，若不在数组中返回-1*/
		lastIndexOf : function(arr, el, start) {
			if ( typeof arr.lastIndexOf === 'function') {
				return arr.lastIndexOf(el, start);
			}

			for ( start = start || arr.length - 1; start > -1; --start) {
				if (arr[start] === el) {
					break;
				}
			}

			return i;
		},
		/*
		 *去除数组的重复元素，返回被删除的元素数组
		 * */
		unique : function(arr) {
			var i, j, len, ret = [];
			for ( i = 0, len = arr.length; i < len; ++i) {
				for ( j = i + 1; j < len; ) {
					if (arr[i] === arr[j]) {
						ret.push(arr.splice(j, 1));
						--len;
					} else {++j;
					}
				}
			}

			return ret;
		},

		/*删除数组中的el元素, 返回删除元素所在的索引位置*/
		del : function(arr, el) {
			var i = XX.Array.indexOf(arr, el);
			if (i > -1) {
				arr.splice(i, 1);
			}

			return i;
		}
	};

	/*
	 *自定义Event事件
	 * */
	XX.Event = function(evtType) {
		this._type = evtType;
		this._handlers = [];
	};

	XX.Event.prototype = {
		"constructor" : XX.Event,
		"getName" : function() {//获取事件名
			return this._type;
		},
		"addHandler" : function(fn, scope) {//添加监听函数
			this._handlers.push({
				"handler" : fn,
				"scope" : scope
			});
		},
		"removeHandler" : function(fn) {//移除监听函数,成功返回true，失败返回false
			var handlers = this._handlers;
			for (var i = handlers.length - 1; i > -1; --i) {
				if (handlers[i].handler === fn) {
					handlers.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		/*触发事件函数，传入监听函数的第一个参数为事件名，传入fire的参数紧接在事件名之后作为监听函数的参数一起传入*/
		"fire" : function() {
			if (this._suspend) {/*该属性为true时，不触发事件*/
				return;
			}

			var handlers = this._handlers, args = [this._type].concat(Array.prototype.slice.call(arguments, 0));
			for (var i = 0, len = handlers.length; i < len; ++i) {
				handlers[i].handler.apply(handlers[i].scope, args);
			}
		},

		"suspend" : function() {
			this._suspend = true;
		},
		"resume" : function() {
			this._suspend = false;
		}
	};

}(); 