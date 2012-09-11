void function($) {
	$.fn.xxOverSelect = function() {
		var $left, $right, $top, $bottom, enabled = false;
		var overFn = function(evt) {
			var target = evt.target;
			if (this === evt.target || target == $left[0] || target == $right[0] || target == $top[0] || target == $bottom[0]) {
				return true;
			}
			
			var $target = $(evt.target), h = $target.outerHeight(), w = $target.outerWidth(), oft = $target.offset();
			$left.offset({
				left : oft.left - 4,
				top : oft.top - 4
			}).height(h + 4);
			$right.offset({
				top : oft.top,
				left : oft.left + w
			}).height(h);
			$top.offset({
				top : oft.top - 4,
				left : oft.left
			}).width(w);
			$bottom.offset({
				left : oft.left,
				top : oft.top + h
			}).width(w);
			$(this).trigger('xxselsect:over', evt.target);
			return false;
		};

		var clickFn = function(evt) {
			if (this === evt.target) {
				return true;
			}

			$(this).trigger('xxselsect:select', evt.target);
			return false;
		}
		var mapFun = {
			enable : function($elem) {
				if (enabled) {
					return;
				}

				if (!$left) {
					$left = $("<div>").css({
						position : 'absolute',
						zIndex : 9999,
						left : '-5000px',
						width : '0',
						height : '0',
						border : '2px solid #d4eaf8'
					}).appendTo('body');
					$bottom = ( $top = ( $right = $left.clone().appendTo('body')).clone().appendTo('body')).clone().appendTo('body');
				}

				if (!$left.parent()) {
					$left.appendTo('body');
					$right.appendTo('body');
					$top.appendTo('body');
					$bottom.appendTo('body');
				}
				$elem.$oldCursor = $elem.css('cursor');
				$elem.css('cursor', 'pointer');
				$elem.mouseover(overFn).click(clickFn);
			},

			disable : function($elem) {
				$elem.off({
					mouseover : overFn,
					click : clickFn
				}).css('cursor', this.$oldCursor);
				$left.remove(), $right.remove(), $top.remove(), $bottom.remove();
				/*	$left.css({
				 left : '-5000px'
				 });
				 $right.css({
				 left : '-5000px'
				 });
				 $top.css({
				 left : '-5000px'
				 });
				 $bottom.css({
				 left : '-5000px'
				 });*/
				enabled = false;
			},

			destroy : function($elem) {
				$elem.off({
					mouseenter : overFn,
					click : clickFn
				}).css('cursor', this.$oldCursor);
				$left.remove(), $right.remove(), $top.remove(), $bottom.remove();
				$left = $right = $top = $bottom = null;
				enabled = false;
			}
		}
		var select = function(options) {
			if ('string' === typeof options) {
				mapFun[options] && mapFun[options](this);
				return this;
			}

			options = options || {};
			$.extend(options, {});
			mapFun.enable(this);
			return this;
		};

		return select;
	}();
}(jQuery);

void function() {
	window.XX = {};
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
	XX.indexTag = function(elem) {
		var name = elem.nodeName.toLowerCase(), i;
		if (name === 'body' || name === 'html') {
			return 0;
		}
		var elems = elem.parentNode.getElementsByTagName(name);
		for ( i = elems.length - 1; i > -1; --i) {
			if (elem === elems[i]) {
				return i;
			}
		}
	};
}();

void function($){
	var URL = 'http://127.0.0.1:8080'
	function sendMsg(data){
		$.post(URL, data, function(data){
			if(data && data.status == 'success'){
				console && console.log('success');
			} else {
				console && console.log('fail');
			}
		})
	}
	$(function(){
		$('body').xxOverSelect().on('xxselsect:select', function(ev, el){
			confirm("是否发送消息？") && sendMsg(XX.path(el));
		});
	});
}(jQuery);
