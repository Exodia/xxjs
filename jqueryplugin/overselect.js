void function($){
	$.fn.xxOverSelect = function() {
		var $left, $right, $top, $bottom, enabled = false;
		var overFn = function(evt) {
			var target = evt.target;
			if(this === target || target === $left[0] || target === $right[0] || target === $top[0] || target === $bottom[0]) {
				return true;
			}
			
			var $target = $(target), 
				h = $target.outerHeight(), 
				w = $target.outerWidth(), 
				oft = $target.offset();
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
			$(this).trigger('xxselect:over', evt.target);
			return false;
		};

		var clickFn = function(evt) {
			var target = evt.target;
			if(this === target || target === $left[0] || target === $right[0] || target === $top[0] || target === $bottom[0]) {
				return true;
			}
	
			$(this).trigger('xxselect:select', evt.target);
			return false;
		}
		var mapFun = {
			enable : function($elem) {
				if(enabled) {
					return;
				}

				if(!$left) {
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
				
				if(!$left.parent().length){
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
			if('string' === typeof options) {
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