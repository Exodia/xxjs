void function(win, undefined) {
	var XX = win.XX || {};
	
	/*获取元素在DOM树中的路径，以“标签名$索引位置>标签名$索引位置“的字符串返回
	 *参数elem:计算路径的元素
	 * 参数root: 路径开始的节点,默认为body,最高也为body
	 * */
	XX.path = function(elem, root) {
		var ret = [], body = document.body, root = root || body;
		while (elem !== root && elem !== body) {
			ret.unshift(elem.nodeName.toLowerCase() + '$' + XX.indexTag(elem));
			elem = elem.parentNode;
		}
		console.log(ret.join('>'));
		return ret.join('>')
	};
	
	
	/*获取元素在DOM树中相同标签节点的位置索引*/
	XX.indexTag = function(elem, deep) {
		var name = elem.nodeName, i, children,
			elems;
		if (name === 'BODY' || name === 'HTML') {
			return 0;
		}
		
		if(deep) {
			elems = elem.parentNode.getElementsByTagName(name);
		} else {
			elems = [];
			children = XX.children(elem.parentNode);
			for(i = 0, len = children.length; i < len; ++i) {
				if(children[i].nodeName === name) {
					elems.push(children[i]);
				}
			}
		}
		
		for ( i = elems.length - 1; i > -1; --i) {
			if (elem === elems[i]) {
				return i;
			}
		}
	};
	
	
	XX.getElementsByRange = function(x1, y1, x2, y2, context) {
		var elems, i, len, ret = [];
		context = context || document.body;
		elems = context.getElementsByTagName('*');
		for(i = 0, len = elems.length; i < len; ++i) {
			XX.isElemInPoint(elems[i], x1, y1, x2, y2) && ret.push(elems[i]);
		}
		
		return ret;
	};
	
	XX.isElemInPoint = function (elem, x1, y1, x2, y2) {
		var temp, elx, ely;
		if(x1 > x2) {
			temp = x1;
			x1 = x2;
			x2 = temp;
		}
		
		if(y1 > y2) {
			temp = y1;
			y1 = y2;
			y2 = temp;
		}
		
		elx = XX.getElemLeft(elem);
		ely = XX.getElemTop(elem);
		
		return (x1 <= elx && x2 >= elx) && (y1 <= ely && y2 >= ely);
	}
	
	/*
	 * 获得elem的前一个非文本节点的兄弟节点
	 * */
	XX.prev = function(elem) {
		/*IE9+, Chrome, FF3.5+ Safari 4+, Opera 10+*/
		if ( typeof elem.previousElementSibling !== 'undefined') {
			return elem.previousElementSibling;
		}

		do {
			elem = elem.previousSibling;
		} while (elem && elem.nodeType != 1)

		return elem;
	};

	/*获取元素的非文本节点集合*/
	XX.children = function(elem) {
		var ret;
		if (elem.children) {
			return nodeListToArray(elem.children);
		}

		ret = [];
		for (var i = 0, nodes = elem.childNodes, len = nodes.length; i < len; ++i) {
			if (nodes[i].nodeType === 1) {
				ret.push(nodes[i]);
			}
		}

		return ret;
	};
	/*
	 * 获得elem的后一个非文本节点的兄弟节点
	 * */
	XX.next = function(elem) {
		/*IE9+, Chrome, FF3.5+ Safari 4+, Opera 10+*/
		if ( typeof elem.nextElementSibling !== 'undefined') {
			return elem.nextElementSibling;
		}

		do {
			elem = elem.nextSibling;
		} while (elem && elem.nodeType != 1)

		return elem;
	};

	/*
	 * 获得elem的第一个非文本节点的兄弟节点
	 * */
	XX.first = function(elem) {
		/*IE9+, Chrome, FF3.5+ Safari 4+, Opera 10+*/
		if ( typeof elem.firstElementChild !== 'undefined') {
			return elem.firstElementChild;
		}

		if (elem.children) {//带children属性，保存着非文本节点
			for (var i = 0, len = elem.children.length; i < len; ++i) {
				/*IE8以及之前的版本children属性包含注释节点，所以这里过滤到第一个元素节点*/
				if (elem.children[i].nodeType === 1) {
					return elem.children[i];
				}
			}
			return null;
		}

		elem = elem.firstChild;
		return elem && elem.nodeType != 1 ? XX.next(elem) : elem;
	};

	/*
	 * 获得elem的最后一个非文本节点的兄弟节点
	 * */
	XX.last = function(elem) {
		/*IE9+, Chrome, FF3.5+ Safari 4+, Opera 10+*/
		if ( typeof elem.lastElementChild !== 'undefined') {
			return elem.lastElementChild;
		}

		if (elem.children) {//带children属性，保存着非文本节点
			for (var i = elem.chidren.length - 1; i > -1; --i) {
				if (elem.children[i].nodeType === 1) {
					return elem.children[i];
				}
			}
			return null;
		}

		elem = elem.lastChild;
		return elem && elem.nodeType != 1 ? XX.prev(elem) : elem;
	};

	/*NodeList转化为数组*/
	XX.nodeListToArray = function(list) {
		var elems = [];
		try {
			elems = Array.prototype.slice.call(list, 0);
		} catch (e) {/*For IE*/
			for (var i = 0, len = list.length; i < len; ++i) {
				elems.push(list[i]);
			}
		}
		return elems;
	};

	/*
	 * 选择文本区域内的一段文字
	 * */
	XX.selectText = function(textfield, start, end) {
		if (textfield.setSelectionRange) {
			textfield.setSelectionRange(start, end);
			textfield.focus();
		} else if (textfield.createTextRange) {
			var range = textfield.createTextRange();
			range.collapse(true);
			range.moveStart('character', start);
			range.moveEnd('character', end - start);
			range.select();
		}

		textfield.focus();
	}
	/*
	 * 获得用户选择的文本
	 * */
	XX.getSelectedText = function(textfield) {
		if (document.selection) {
			return document.selection.createRange().text;
		} else {
			return textfield.value.substring(textfield.selectionStart, textfield.selectionEnd);
		}
	};

	/*
	 * @param {Object} name
	 * 需要查找的类名
	 * @param {Object} type
	 * 需要匹配的元素，默认为全部
	 * 返回符合匹配的元素集合
	 */
	XX.getElementsByClassName = function(name, type, context) {
		context = context || document;
		var ret = null;
		if (context.getElementsByClassName) {
			ret = XX.nodeListToArray(context.getElementsByClassName(name));
			if (type) {
				type = type.toUpperCase();
				for (var i = 0, len = ret.length; i < len; ) {
					if (ret[i].nodeName !== type) {
						ret.splice(i, 1);
					} else {++i;
					}
				}
			}
		} else {
			var elems = context.getElementsByTagName(type || '*'), reg = new RegExp("(^|\\s)" + name + "($|\\s)");

			ret = [];
			for (var i = 0, len = elems.length; i < len; ++i) {
				if (reg.test(elems[i].className)) {
					ret.push(elems[i]);
				}
			}
		}

		return ret;
	};

	/*
	 *判断ances是否是elem的祖先节点
	 * 是则返回true，否则返回false;
	 * */
	XX.isAncestor = function(ances, elem) {
		if ( typeof ances.contains == 'function') {//IE、Safari3+、Opera、Chrome
			return ances.contains(elem);
		} else if ( typeof ances.compareDocumentPosition == 'function') {
			return !!(ances.compareDocumentPosition(elem) & 16);
		} else {
			var par = elem.parentNode;
			while (par !== null) {
				if (ances === par) {
					return true;
				}

				par = par.parentNode;
			}

			return false;
		}
	};

	/*
	 *判断elem1与elem2是否是兄弟节点
	 * */
	XX.isSibling = function(elem1, elem2) {
		return elem1.parentNode === elem2.parentNode;
	};

	/*
	 *检测元素是否具有给定的类名，有则返回true，否则返回false
	 * */
	XX.hasClass = function(elem, name) {
		if (elem.classList) {//FF3.6+, Chrome
			return elem.classList.contains(name);
		}

		if (elem.className) {
			var reg = new RegExp("(^|\\s)" + name + "($|\\s)");
			return reg.test(elem.className);
		}

		return false;
	};

	/*
	 *给元素添加一个类
	 * */
	XX.addClass = function(elem, name) {
		if (elem.classList) {//FF3.6+, Chrome
			return elem.classList.add(name);
		}

		if (!XX.hasClass(elem, name)) {
			elem.className = elem.className ? elem.className + ' ' + name : name;
		}
	}
	/*
	 *移除元素的一个类
	 * */
	XX.removeClass = function(elem, name) {
		if (elem.classList) {//FF3.6+, Chrome
			elem.classList.remove(name);
			return;
		}

		if (elem.className) {
			var reg = new RegExp("(^|\\s)" + name + "($|\\s)", 'g');
			elem.className = XX.trim(elem.className.replace(reg, ' '));
		}
	};

	/*
	 *若元素存在name类名，则移除该类，否则添加该类
	 * */
	XX.toggleClass = function(elem, name) {
		if (elem.classList) {//FF3.6+, Chrome
			elem.classList.toggle(name);
			return;
		}

		if (XX.hasClass(elem, name)) {
			XX.removeClass(elem, name);
		} else {
			XX.addClass(elem, name);
		}
	}
	/*
	 *寻找首个具有对应类名的父元素
	 * */
	XX.getParentByClassName = function(elem, name) {
		var parent = elem.parentNode;
		while (parent) {
			if (XX.hasClass(parent, name)) {
				return parent;
			}
		}

		return null;
	};

	/*
	 * @param {Object} elem
	 * 获取参数elem元素内的文本内容
	 */
	XX.getInnerText = function(elem) {
		return typeof elem.textContent == "string" ? elem.textContent : elem.innerText;
	};

	/*
	 * 设置elem元素内的文本节点为text
	 */
	XX.setInnerText = function(elem, text) {
		if ( typeof elem.textContent == "string") {
			elem.textContent = text;
		} else {
			elem.innerText = text;
		}
	};

	/*
	 *在元素之后插入某个元素
	 * */
	XX.insertAfter = function(newElem, old) {
		old.parentNode.insertBefore(newElem, old.nextSibling);
	};

	/*
	 * 加载脚本资源
	 * src: 脚本链接
	 * callback:加载完成后的回调函数
	 * */
	XX.loadScript = function(src, callback) {
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = src;
		if (script.readyState) {//IE
			script.onreadystatechange = function() {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					callback();
				}
			}
		} else {
			script.onload = function() {
				callback();
			}
		}
		document.body.appendChild(script);
	};

	/*
	 * 加载字符串的脚本代码
	 * */
	XX.loadScriptString = function(code) {
		var script = document.createElement('script');
		script.type = "text/javascript";
		try {
			script.appendChild(document.createTextNode(code));
		} catch(e) {//IE
			script.text = code;
		}
		document.body.appendChild(script);
	};

	/*
	 * 加载样式表
	 * */
	XX.loadStyle = function(url) {
		var link = document.createElement('link');
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;

		document.getElementsByTagName('head')[0].appendChild(style);
	}
	/*
	 * 加载字符串的样式
	 * */
	XX.loadStyleString = function(css) {
		var style = document.createElement('style');
		style.type = "text/css";
		try {
			style.appendChild(document.createTextNode(css));
		} catch(e) {//IE
			style.styleSheet.cssText = css;
		}

		document.getElementsByTagName('head')[0].appendChild(style);
	}
	/*
	 * 获取元素实际的样式属性值
	 */
	XX.getStyle = function(elem, name) {
		if (elem.style[name]) {
			return elem.style[name];
		}
		/*针对IE*/
		if (elem.currentStyle) {
			return elem.currentStyle[name];
		}
		/*W3C标准*/
		if (document.defaultView && document.defaultView.getComputedStyle) {
			var s = document.defaultView.getComputedStyle(elem, null);
			return s && s[name];
		}

		return null;
	};

	/*
	 * 获取元素在页面上的偏移量
	 */
	XX.getElemLeft = function(elem) {
		var left = elem.offsetLeft, cur_parent = elem.offsetParent;

		while (null !== cur_parent) {
			left += cur_parent.offsetLeft;
			cur_parent = cur_parent.offsetParent;
		}

		return left;
	};

	XX.getElemTop = function(elem) {
		var top = elem.offsetTop, cur_parent = elem.offsetParent;

		while (null !== cur_parent) {
			top += cur_parent.offsetTop;
			cur_parent = cur_parent.offsetParent;
		}

		return top;
	};

	/*
	 * 获得元素相对于其父元素的偏移量
	 */
	XX.getParentLeft = function(elem) {
		return elem.parentNode === elem.offsetParent ? elem.offsetLeft : XX.getElemLeft(elem) - XX.getElemLeft(elem.parentNode);
	};

	XX.getParentTop = function(elem) {
		return elem.parentNode === elem.offsetParent ? elem.offseTop : XX.getElemTop(elem) - XX.getElemTop(elem.parentNode);
	};

	/*
	 * 获得元素相对于其定位容器的偏移量
	 */
	XX.getPositionLeft = function(elem) {
		return parseInt(XX.getStyle(elem, 'left'));
	};

	XX.getPositionTop = function(elem) {
		return parseInt(XX.getStyle(elem, 'top'));
	};

	/*
	 * 设置元素相对于其定位容器的偏移量
	 */
	XX.setPositionLeft = function(elem, value) {
		elem.style.left = value + 'px';
	};

	XX.setPositionTop = function(elem, value) {
		elem.style.top = value + 'px';
	};

	/*
	 * 获取元素的宽度和高度
	 */
	XX.getHeight = function(elem) {
		return parseInt(XX.getStyle(elem, 'height'));
	};
	XX.getWidth = function(elem) {
		return parseInt(XX.getStyle(elem, 'width'));
	};

	/*
	 *在元素原有的CSS属性上修改或添加CSS属性
	 *参数css_obj：要添加或修改的CSS属性
	 *返回值：元素最初的被修改或添加的CSS属性值
	 */
	XX.resetCSS = function(elem, css_obj) {
		var old = {};
		for (var k in css_obj) {
			old[k] = elem.style[k];
			elem.style[k] = css_obj[k];
		}

		return old;
	};

	/*
	 *设置元素的相关CSS属性，参数与XX.resetCSS函数一样，返回undefined
	 */
	XX.setCSS = function(elem, css_obj) {
		for (var k in css_obj) {
			elem.style[k] = css_obj[k];
		}
	};

	/*
	 * 获取元素潜在的完整宽度和高度
	 */
	XX.getFullHeight = function(elem) {
		//若元素display不为none，那么使用offsetHeight获得完整高度，若没有offsetHeight，则使用getHeight
		if (XX.getStyle(elem, 'display') != 'none') {
			return elem.offsetHeight || XX.getHeight(elem);
		}

		//否则，我们重置它的CSS属性以获得更精确的数据
		var old = XX.resetCSS(elem, {
			display : 'block',
			visibility : 'hidden',
			position : 'absolute'
		});

		//使用clientHeight找出元素的完整高度，如果不生效，使用getHeight函数
		var h = elem.clientHeight || XX.getHeight(elem);

		//恢复元素的CSS属性
		XX.setCSS(elem, old);

		return h;
	};

	XX.getFullWidth = function(elem) {
		if (XX.getStyle(elem, 'display') != 'none') {
			return elem.offsetWidth || XX.getWidth(elem);
		}

		var old = XX.resetCSS(elem, {
			display : 'block', //设置为''的话，在通过样式表设置的display:none下是不工作的
			visibility : 'hidden',
			position : 'absolute'
		});

		var w = elem.clientWidth || XX.getWdith(elem);

		XX.setCSS(elem, old);

		return w;
	};

	/*
	* 使用display属性来切换元素可见性的一组函数
	*/
	//隐藏元素函数
	XX.hide = function(elem) {
		var cur_display = XX.getStyle(elem, 'display');

		if (cur_display != 'none') {
			elem.$oldDisplay = cur_display;
		}

		elem.style.display = 'none';
	};
	/*显示元素函数
	 * 参数type: 要显示的格式（'block'、'inline'等），
	 * 若不输入，则先查找元素是否有保存的display属性，若有，则更改为保存的display属性，
	 * 否则默认为''，此时会清除元素的display属性，从而继承样式表的display属性，
	 * 若样式表display为none，此时元素则不会显示出来
	 */
	XX.show = function(elem, type) {
		elem.style.display = elem.$oldDisplay || type || '';
	};

	/*
	 *调节元素透明度函数(level从0-100)
	 */
	XX.setOpacity = function(elem, level) {
		//如果存在filters这个属性，则它是IE，所以设置元素的Alpha滤镜
		if (elem.filters) {
			elem.style.filter = 'alpha(opacity=' + level + ')';
			//必须设置zoom,要不然透明度在IE下不生效
			elem.style.zoom = 1;
		} else {
			//否则使用W3C的opacity属性
			elem.style.opacity = level / 100;
		}
	};
	/*
	 *让一个元素渐显（通过短时间内逐步增加透明度显示）
	 */
	XX.fadeIn = function(elem) {
		XX.setOpacity(elem, 0);

		XX.show(elem);

		for (var i = 0; i <= 100; i += 5) {
			//闭包函数
			(function() {
				var pos = i;
				setTimeout(function() {
					XX.setOpacity(elem, pos);
				}, (pos + 1) * 10);
			})();
		}
	};

	/*
	 *滑动展开函数：在短时间内增加高度或宽度逐步显示隐藏元素
	 *type: 按何种类型展开（宽度或高度），应输入'width'或'height'或'both'，默认为'both'
	 *wvalue:要展开的最终宽度值，默认为元素的潜在完整宽度,若hvalue未输入，则默认为宽度和高度的值
	 *hvalue:要展开的最终高度值，默认为元素的潜在完整高度
	 */
	XX.slideOpen = function(elem, type, wvalue, hvalue) {
		type = type || 'both';
		var h, w, len = arguments.length;

		if (4 === len) {//4个参数均指明
			w = wvalue;
			h = hvalue;
			if ('both' !== type) {
				elem.style[type] = '0px';
				//从0px开始展开
			} else {
				elem.style.height = '0px';
				//从0px开始展开
				elem.style.width = '0px';
			}
		} else if (3 === len) {//只指明了3个参数
			w = h = wvalue;
			if ('both' !== type) {
				elem.style[type] = '0px';
				//从0px开始展开
			} else {
				elem.style.height = '0px';
				//从0px开始展开
			}
		} else {
			if ('height' === type) {
				h = XX.getFullHeight(elem);
				elem.style.height = '0px';
			}
			if ('width' === type) {
				w = XX.getFullWidth(elem);
				elem.style.width = '0px';
			}
			if ('both' === type) {
				h = XX.getFullHeight(elem);
				w = XX.getFullWidth(elem);
				elem.style.height = '0px';
				elem.style.width = '0px';
			}
		}

		XX.show(elem, 'block');
		//先显示元素，但是看不到它，因为元素宽或高为0

		for (var i = 0; i <= 100; i += 5) {
			(function() {
				var pos = i;
				setTimeout(function() {
					switch(type) {
						case 'height':
							elem.style.height = (pos / 100) * h + 'px';
							break;
						case 'width':
							elem.style.width = (pos / 100) * w + 'px';
							break;
						default:
							elem.style.height = (pos / 100) * h + 'px';
							elem.style.width = (pos / 100) * w + 'px';
					}
				}, (pos + 1) * 10);
			})();
		}
	};

	/*
	 *获得页面的视口尺寸（不包括滚动条之外的内容）
	 *innerHeight: FF和Chrome支持，IE不支持
	 */
	XX.getWindowHeight = function() {
		//用于IE6/7的严格模式中
		var de = document.documentElement;
		return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
	};

	XX.getWindowWidth = function() {
		//用于IE6/7的严格模式中
		var de = document.documentElement;
		return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	};

	/*
	 * 返回页面的潜在完整宽度和高度（包括滚动条之外的内容）
	 * 在chrome下，还应该比较body的scrollHeight， 主要影响因素是元素的absolute定位
	 */
	XX.getPageHeight = function() {
		var de = document.documentElement;
		if (de) {
			return Math.max(de.scrollHeight, de.clientHeight, document.body.scrollHeight);
		} else {
			return document.body.scrollHeight;
		}
	};

	XX.getPageWidth = function() {
		var de = document.documentElement;
		if (de) {
			return Math.max(de.scrollWidth, de.clientWidth, document.body.scrollWidth);
		} else {
			return document.body.scrollWidth;
		}
	};

	/*
	 * 确定浏览器滚动条位置的函数
	 * pageXOffset:经测试，chrome和FF下存在，IE下无效
	 */
	XX.getScrollX = function() {
		//用于IE6/7的严格模式中
		var de = document.documentElement;

		return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
	};

	XX.getScrollY = function() {
		//用于IE6/7的严格模式中
		var de = document.documentElement;

		return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
	};

	/*
	 *DOM内容加载完毕后执行脚本代码
	 * fn：待执行的函数
	 * scope: fn的执行作用域
	 */
	XX.domReady = function(fn, scope) {
		var doc = document, readyFn = null;

		if (doc.addEventListener) {//W3C标准
			readyFn = function() {
				doc.removeEventListener('DOMContentLoaded', readyFn, false);
				fn.apply(scope);
			};

			doc.addEventListener('DOMContentLoaded', readyFn, false);
		}

		/*IE下*/
		else if (doc.attachEvent) {
			readyFn = function() {
				if (doc.readyState == 'complete' && !readyFn.done) {
					readyFn.done = true;
					fn.apply(scope);

					doc.detachEvent('onreadystatechange', readyFn);
					window.detachEvent('onload', readyFn);
				}
			};

			doc.attachEvent('onreadystatechange', readyFn);
			window.attachEvent('onload', readyFn);
			void function() {
				if (readyFn.done) {
					return;
				}

				try {
					document.documentElement.doScroll("left");
				} catch(e) {
					setTimeout(arguments.callee, 1);
					return;
				}

				readyFn.done = true;
				fn.apply(scope);
			}();
		}
	};

	XX.isWindow = function(elem) {
		var des = Object.prototype.toString.call(elem);
		//FireFox Chrome Safria
		if (des == "[object Window]" || des == "[object global]" || des == "[object DOMWindow]") {
			return true;
		}

		if (des == "[object Object]" && elem.window == elem) {
			return true;
		}
	};

	/*事件组件命名空间*/
	XX.EventUtil = {
		/*
		 * 添加事件
		 * */
		addEvent : function(elem, type, handler, hasCapture) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, hasCapture);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			} else {
				elem['on' + type] = handler;
			}
		},

		/*
		 * 移除事件
		 * */
		removeEvent : function(elem, type, handler, hasCapture) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handler, hasCapture);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + type, handler);
			} else {
				elem['on' + type] = null;
			}
		},

		/*
		 * 获取事件对象
		 * */
		getEvent : function(evt) {
			return evt ? evt : window.event;
		},

		/*
		 * 添加事件源
		 * */
		getTarget : function(evt) {
			return evt.target || evt.srcElement;
		},

		/*
		 * 阻止事件默认行为
		 * */
		preventDefault : function(evt) {
			if (evt.preventDefaut) {
				evt.preventDefaut();
			} else {
				evt.returnValue = false;
			}
		},

		/*
		 * 阻止事件冒泡
		 * */
		stopPropagation : function(evt) {
			if (evt.stopProgapation) {
				evt.stopProgapation();
			} else {
				evt.cancelBubble = true;
			}
		},

		/*
		 * 获取事件关联元素
		 * */
		getRelatedTarget : function(evt) {
			return evt.relatedTarget || evt.fromElement || evt.toElement || null;
		},

		/*
		 * 获得按下的鼠标按钮值， 0为鼠标左键按下， 1为中， 2为右
		 **/
		getButton : function(evt) {
			if (document.implementation.hasFeature('MouseEvents', '2.0')) {
				return evt.button;
			} else {
				switch(evt.button) {
					case 0:
					case 1:
					case 3:
					case 5:
					case 7:
						return 0;
					case 2:
					case 6:
						return 2;
					case 4:
						return 1;
				}
			}
		},

		/*
		 * 获取鼠标相对于整个页面的偏移量
		 * @param {Object} e
		 */
		getX : function(evt) {
			//先检查非IE浏览器的位置，再检查IE的位置
			return (evt && evt.pageX) || window.event.clientX + document.body.scrollLeft;
		},

		getY : function(evt) {
			return (evt && evt.pageY) || window.event.clientY + document.body.scrollTop;
		},

		/*
		 *获取光标相对于当前正在交互的元素的x和y位置
		 *layerX的作用：网上很多解释说layerX与offsetX的作用相同．可以返回鼠标指针在触发事件元素内的x坐标
		 *也有解释说相对于父元素的x坐标．经过我的测试得出以下结论：
		 *layerX可以返回两种结果．第一：layerX属性可以返回鼠标指针相对于父元素的x坐标水平位置．
		 *第二：layerX属性可以返回鼠标指针相对于元素本身的x坐标水平位置．
		 *比如说我需要在某个div内获取鼠标指针的x水平位置．
		 *如果你没有使用Css中的position属性来对该div进行任何设置．
		 *那么这时layerX返回的是相对于div父元素的x坐标．也就是包含该div的那个元素．
		 *如果将div的position属性设置为absolute或relative时．layerX则返回元素本身的x水平位置．
		 *这时返回的值与clientX的值相同．另外提醒的是layerX支持FF和Safari浏览器，在IE和Opear中无法使用．
		 */
		getElementX : function(evt) {
			return evt.offsetX || evt.layerX;
		},

		getElementY : function(evt) {
			return evt.offsetY || evt.layerY;
		},

		/*
		 * 获得键盘编码
		 * */
		getKeyCode : function(evt) {
			return typeof evt.charCode == 'number' ? evt.charCode : evt.keyCode;
		}
	};
	/*短引用*/
	XX.addEvent = XX.on = XX.bind = XX.EventUtil.addEvent;
	XX.removeEvent = XX.un = XX.unbind = XX.EventUtil.removeEvent;

	win.XX = XX;
}(window, undefined);
