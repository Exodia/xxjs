/*
	 * Extension命名空间
	 * 主要包括一些扩展功能，如老式浏览器中实现HTML5的placeholder功能
	 **/
	XX.Extension = XX.Extension || {};

	/*
	 *检测浏览器是否支持placeholder特性;支持返回true，否则返回false
	 * */
	XX.Extension.isSupportPlaceHolder = function() {
		return 'placeholder' in document.createElement('input');
	};

	/*
	 *让老式浏览器启用placeholder特性，引入脚本后，在页面加载完毕调用该函数即可；
	 * 占位符文本的字体颜色， 默认为浏览器默认颜色,
	 * 可在调用此函数前设置XX.Extension.enablePlaceHolder.holderColor,使得占位符呈现自定义颜色
	 * */
	XX.Extension.enablePlaceHolder = function() {
		var color = XX.Extension.enablePlaceHolder.holderColor || '';
		/*原生支持placeholder，且无需设置占位符文本颜色，则直接返回*/
		if(XX.Extension.isSupportPlaceHolder() && !color) {
			return;
		}

		var addEvent = XX.EventUtil.addEvent, getTarget = XX.EventUtil.getTarget, preventDefault = XX.EventUtil.preventDefault;

		/*内部focus事件监听函数*/
		var _focusHandler = function(evt) {
			evt = evt || window.event;
			var elem = getTarget(evt), hldTxt = elem.getAttribute('placeholder') || elem.getAttribute('placeHolder');
			if(hldTxt == elem.value) {//如果文本框文字与占位符文本一致，则清空文本框
				elem.value = '';
				elem.style.color = elem.$oldColor || '';
				//撤销占位符字体颜色
			}
		};

		/*内部blur事件监听函数*/
		var _blurHandler = function(evt) {
			evt = evt || window.event;
			var elem = getTarget(evt), hldTxt = elem.getAttribute('placeholder') || elem.getAttribute('placeHolder');
			if(hldTxt == elem.value || elem.value == '') {//如果文本框文字与占位符文本一致，则设置占位符字体颜色
				elem.value = hldTxt;
				//若值为空，则还原占位符文本
				elem.$oldColor = elem.style.color;
				//保存原有的字体色
				elem.style.color = color || '';
				//设置占位符字体颜色
			}
		};

		/*遍历HTML文档查找类型为text且带有placholder/placeHolder特性的input元素*/
		var elems = document.getElementsByTagName('input');
		for(var i = elems.length - 1; i > -1; --i) {
			if(elems[i].type === 'text') {
				var hldTxt = elems[i].getAttribute('placeholder') || elems[i].getAttribute('placeHolder');
				if(hldTxt) {
					addEvent(elems[i], 'focus', _focusHandler);
					addEvent(elems[i], 'blur', _blurHandler);

					if(!elems[i].value) {
						elems[i].value = hldTxt;
					}
					if(color && (hldTxt == elems[i].value)) {//设置占位符文本字体
						elems[i].$oldColor = elems[i].style.color;
						elems[i].style.color = color;
					}
				}
			}
		}

		/*遍历HTML文档查找带有placholder/placeHolder特性的textarea元素*/
		var elems = document.getElementsByTagName('textarea');
		for(var i = elems.length - 1; i > -1; --i) {
			var hldTxt = elems[i].getAttribute('placeholder') || elems[i].getAttribute('placeHolder');
			if(hldTxt) {
				addEvent(elems[i], 'focus', _focusHandler);
				addEvent(elems[i], 'blur', _blurHandler);

				if(!elems[i].value) {
					elems[i].value = hldTxt;
				}
				if(color && (hldTxt == elems[i].value)) {//设置占位符文本字体
					elems[i].$oldColor = elems[i].style.color;
					elems[i].style.color = color;
				}
			}
		}
	};