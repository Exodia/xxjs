/*
 *XX.Message命名空间
 * */
window.XX || (window.XX = {});
XX.Message = XX.Message || {};

/*显示对话框*/
void function() {
	var dialog = null, head = null, main = null, closeBtn = null, isShowed = false;
	var _show = function(title, content) {
		if(null == dialog) {
			dialog = document.createElement('div');
			head = document.createElement('div');
			main = document.createElement('div');
			head.innerHTML = title;
			main.innerHTML = content;
			closeBtn = document.createElement('button');
			closeBtn.innerHTML = "关闭";
			closeBtn.onclick = function(evt) {
				_hide();
				evt = evt || window.event;
				XX.EventUtil.stopPropagation(evt);
			}
			XX.setCSS(dialog, {
				width : '300px',
				height : '300px',
				padding : '5px',
				backgroundColor : '#9FDCFB',
				position : 'absolute',
				right : '40%',
				bottom : '200px'
			});
			XX.setCSS(head, {
				fontWeight : 'bold',
				textAlign : 'center',
				height : '20px',
				padding : '5px'
			});
			XX.setCSS(main, {
				height : '75%',
				overflow : 'auto',
				padding : '5px',
				width : '280',
				backgroundColor : 'white',
				whiteSpace : 'normal',
				wordBreak : 'break-all'
			});
			XX.setCSS(closeBtn, {
				position : 'absolute',
				bottom : '5px',
				left : '130px'
			});
			dialog.appendChild(head);
			dialog.appendChild(main);
			dialog.appendChild(closeBtn);
			document.body.appendChild(dialog);
		} else {
			head.innerHTML = title;
			main.innerHTML = content;
			dialog.style.display = '';
		}
	};

	function _hide() {
		if(dialog) {
			dialog.style.display = 'none';
		}
	}


	XX.Message.show = _show;
	XX.Message.hide = _hide;
}();