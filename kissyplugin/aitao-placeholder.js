KISSY.add('aitao-placeholder', function(S) {
	/*
	 *检测浏览器是否支持placeholder特性;支持返回true，否则返回false
	 * */
	var isSupportPlaceHolder = function() {
		return 'placeholder' in document.createElement('input');
	};

	var D = S.DOM, E = S.Event;

	/*
	 *让老式浏览器启用placeholder特性，引入脚本后，在页面加载完毕调用该函数即可；
	 * 占位符文本的字体颜色， 默认为浏览器默认颜色,
	 * color:设置占位符文本颜色
	 * */
	var Placeholder = function(el, color) {

		/*原生支持placeholder，且无需设置占位符文本颜色，则直接返回*/
		if (isSupportPlaceHolder() && !color) {
			return;
		}

		if (!( el = D.get(el))) {
			return;
		}

		/*内部focus事件监听函数*/
		var _focusHandler = function(evt) {
			hldTxt = D.attr(this, 'placeholder');
			//如果文本框文字与占位符文本一致，则清空文本框
			if (hldTxt == this.value) {
				var $oldColor = D.data(this, 'oldColor');
				this.value = '';
				//撤销占位符字体颜色
				$oldColor && (D.css(this, 'color', $oldColor));
			}
		};

		/*内部blur事件监听函数*/
		var _blurHandler = function(evt) {
			var hldTxt = D.attr(this, 'placeholder');
			//如果文本框文字与占位符文本一致，则设置占位符字体颜色
			if (hldTxt == this.value || this.value == '') {
				//若值为空，则还原占位符文本
				this.value = hldTxt;
				//保存原有的字体色
				D.data(this, 'oldColor', D.css(this, 'color'));
				//设置占位符字体颜色
				color && D.css(this, 'color', color);
			}
		};

		E.on(el, 'focus', _focusHandler);
		E.on(el, 'blur', _blurHandler);

		el.form && E.on(el.form, 'submit', function(ev) {
			_focusHandler.call(el);
			setTimeout(function() {
				_blurHandler.call(el);
			}, 10);
		});

		_blurHandler.call(el);
	};

	return Placeholder;
});

