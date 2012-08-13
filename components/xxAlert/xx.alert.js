var XX = window.XX || {};

XX.alert = function(){
	var _alertQueue = []; //消息队列
	
 	return function(title, content){
		var mask = XX.alert.mask, outDiv = XX.alert.outDiv;
		
		if (!mask) { //若相关的alert元素不存在则先创建
			mask = XX.alert.mask = document.createElement('div');
			outDiv = XX.alert.outDiv = mask.cloneNode(false);
			outDiv.id = 'xx-alert-out';
			mask.id = 'xx-mask';
			
			outDiv.innerHTML = '<h5 class="alert-title" id="aTitle">' + title +
			'</h5><p class="alert-content" id="aCtn">' +
			content +
			'</p><input type="button" value="确定" id="alert-btn"/>';
			document.body.appendChild(mask);
			document.body.appendChild(outDiv);
			
			XX.alert.title = document.getElementById('aTitle');
			XX.alert.content = document.getElementById('aCtn');
			XX.alert.isShowing = true;
			var alertBtn = document.getElementById('alert-btn');
			alertBtn.onclick = function(){ //‘确定’按钮事件，点击则隐藏
				XX.hide(outDiv);
				XX.hide(mask);
				var de = document.documentElement;
				de.style.overflow = de.$oldOverflow || '';
				XX.alert.isShowing = false;
				
				var msg = _alertQueue.shift();
				if(msg){ //还有消息，继续显示
					XX.alert(msg.title, msg.content);
				}
			};
		}
		else if(XX.alert.isShowing){
			_alertQueue.push({
				title:title,
				content:content
			});
		} else{
			document.getElementById('aTitle').innerHTML = title;
			document.getElementById('aCtn').innerHTML = content;
		}
		
		XX.show(outDiv);
		XX.alert.isShowing = true;
		
		var winWidth     = XX.getWindowWidth(), 
			winHeight    = XX.getWindowHeight(), 
			scrollWidth  = document.body.scrollWidth, 
			scrollHeight = document.body.scrollHeight,
			pageHeight   = XX.getPageHeight(),
			pageWidth    = XX.getPageWidth();
		
		/*设置alert框居中*/
		outDiv.style.left = (winWidth - outDiv.offsetWidth) / 2 + 'px';
		outDiv.style.top = (winHeight - outDiv.offsetHeight) / 2 + 'px';
		
		/*设置遮罩高度和宽度充满整个浏览器*/
		mask.style.width = pageWidth + 'px';
		mask.style.height = pageHeight + 'px';
		XX.show(mask); //显示出来
		/*mask显示时，设置HTML和BODY元素overflow为隐藏*/
		var de = document.documentElement;
		de.$oldOverflow = de.style.overflow;
		de.style.overflow = 'hidden';
	}
}();


/*设置mask层高度宽度以响应滚动事件和调整窗口大小事件*/
XX.alert.setMaskSize = function(){
	if(/MSIE ([^;]+)/.test(navigator.userAgent)){
		return function(){
			XX.alert.mask.style.width = XX.getWindowWidth() + XX.getScrollX()  + 'px';
			XX.alert.mask.style.height = XX.getWindowHeight() + XX.getScrollY() + 'px';
		};
	} else {
		return function(){
			XX.alert.mask.style.width = XX.getWindowWidth() + XX.getScrollX() - 17 + 'px';
			XX.alert.mask.style.height = XX.getWindowHeight() + XX.getScrollY() - 17 + 'px';
		}
	}
}();

/*添加删除事件函数*/
XX.addEvent = function(elem, type, handler){
	if(elem.addEventListener){
		elem.addEventListener(type, handler, false);
		XX.addEvent = function(elem, type, handler){
			elem.addEventListener(type, handler, false);
		};
	} else {
		elem.attachEvent('on'+type, handler);
		XX.addEvent = function(elem, type, handler){
			elem.attachEvent('on'+type, handler);
		};
	}
};

XX.removeEvent = function(elem, type, handler){
	if(elem.removeEventListener){
		XX.removeEvent = function(elem, type, handler){
			elem.removeEventListener(type, handler, false);
		};
	} else {
		XX.removeEvent = function(elem, type, handler){
			elem.detachEvent('on'+type, handler);
		};
	}
};

/*
 * 确定浏览器滚动条位置的函数
 * pageXOffset:经测试，chrome和FF下存在，IE下无效
 */
XX.getScrollX = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;
	
	return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
};

XX.getScrollY = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;
	
	return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
};

/*
 *获得页面的视口尺寸（不包括滚动条之外的内容） 
 *innerHeight: FF和Chrome支持，IE不支持
 */
XX.getWindowHeight = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;
	
	return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};

XX.getWindowWidth = function(){
	//用于IE6/7的严格模式中
	var de = document.documentElement;
	
	return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};

XX.getPageHeight = function(){
	var de = document.documentElement;
	if(de){
		return Math.max(de.scrollHeight, de.clientHeight, document.body.scrollHeight);
	} else {
		return document.body.scrollHeight;
	}
};

XX.getPageWidth = function(){
	var de = document.documentElement;
	if(de){
		return Math.max(de.scrollWidth, de.clientWidth, document.body.scrollWidth);
	} else {
		return document.body.scrollWidth;
	}
};

//隐藏元素函数
XX.hide = function(elem){
	var cur_display = elem.style.display;
	
	if(cur_display != 'none'){
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
XX.show = function(elem, type){
	elem.style.display = elem.$oldDisplay || type || '';
};