/*命名空间*/
window.XX = window.XX || {};
XX.form = XX.form || {};
/*根据opts的条目，设置elem的CSS属性*/
XX.setCSS = function(elem, opts){
	var style = elem.style;
	for(var k in opts){
		if(k === 'float'){
			style.cssFloat = style.styleFloat = opts[k];
		}
	   style[k] = opts[k];	
	}
};

/*事件添加函数*/
XX.addEvent = function(elem, type, fn){
	if(elem.addEventListener){
		elem.addEventListener(type, fn, false);
	} else {
		elem.attachEvent('on' + type, fn);
	}
};

/*
Form组件之下拉框：
参数opts：JSON数据，可传入以下选项
	{
		items:[17,18,19,20],  //这里设置下拉列表值
		name: 'age', //这里设置要提交时的name值
		css:{position:'absolute', left:'65px', top:'0px'}, //这里设置要给组件添加的CSS值,注意用骆峰的形式,如： backgroundColor
		renderElem:document.getElementById('ageCombox') //这里选择ComboBox的父节点	
	}
*/

XX.form.ComboBox = function(){ 
	var _listShowing = null; //记录正在显示的下拉列表
	XX.addEvent(document, 'click', function(evt){
		  if(_listShowing !== null){
			  _listShowing.isShowing = false;
			  _listShowing.style.display = '';
		  }
	});
	return function(opts){
	  opts = opts || {};
	  this.name = opts.name || '';
	  this.renderElem =  opts.renderElem;
	  this.height = opts.height;
	  this.width  = opts.width;
	  this.maxHeight = opts.maxHeight || 170;
	  this.size = opts.size || 20;
	  var ctn = this.domEl = document.createElement('div'),
		  itemstr = '<input type="text" autocomplete="off" class="xx-combox-input" name="' + opts.name + 
					'" /><img class="xx-combox-btn" src="images/trigger.jpg" /><div class="xx-combox-itmCtn">';
	  ctn.className = 'xx-combox-ctn';
	  /*设置传入的css*/
	  if(opts.css){
		  XX.setCSS(ctn, opts.css);
	  }
	  
	  if(opts.items){
		 var its = [], items = this.items = opts.items;
		 for(var i = 0, len = items.length; i < len; ++i){
			   its.push ('<div class="xx-combox-item" >' + items[i] + '</div>');
		 }
		 itemstr += its.join('');	
	  }
	  itemstr += '</div>';
	  ctn.innerHTML = itemstr;
	  
	  if(this.height){
		  ctn.firstChild.style.height = this.height + 'px';
		  ctn.firstChild.nextSibling.style.height =  this.height + 'px';
	  }
	  if(this.maxHeight){
	  	  ctn.lastChild.maxHeight = this.maxHeight;	
		   ctn.lastChild.style.maxHeight = this.maxHeight + 'px';
	  }
	  
	  if(this.width){
		  ctn.firstChild.style.width = this.width + 'px';  
		  ctn.lastChild.style.width = this.width + 23 + 'px';
		  ctn.style.width = this.width + 25 + 'px';
	  }
	  ctn.firstChild.size = this.size;
	  
	  /*input框click事件，阻止事件继续冒泡以免被document捕捉到而隐藏下拉列表*/
	  ctn.firstChild.onclick = function(evt){
		  var evt    = evt || window.event;
		   /*阻止冒泡*/
		  if(evt.stopPropagation){
			  evt.stopPropagation();
		  } else {
			 evt.cancelBubble = true;  
		  }
	  };
	  /*下拉按钮触发事件*/
	  ctn.childNodes[1].onclick = function(evt){
		   var evt    = evt || window.event,
		       itm    = this.nextSibling;
			   
		  if(itm.isShowing){
			  itm.isShowing = false;
			  itm.style.display = '';
		  } else {
			  itm.isShowing = true;
			  itm.style.display = 'block';	
			  _listShowing = itm;
		  }	
		  
		  /*阻止冒泡*/
		  if(evt.stopPropagation){
			  evt.stopPropagation();
		  } else {
			 evt.cancelBubble = true;  
		  }
	  };
	  /*设置列表框初始状态和各种事件响应状态*/
	  var itmCtn = ctn.childNodes[2];
	  itmCtn.isShowing = false;
	  itmCtn.onmouseover = function(evt){
		  var evt    = evt || window.event,
			  target = evt.target || evt.srcElement;
			  
		  if(target.className === 'xx-combox-item'){
			  target.style.backgroundColor = '#F0F0F0';	
		  }
	  };
	  itmCtn.onmouseout = function(evt){
		  var evt    = evt || window.event,
			  target = evt.target || evt.srcElement;
			  
		  if(target.className === 'xx-combox-item'){
			  target.style.backgroundColor = '';	
		  }
	  };
	  itmCtn.onclick = function(evt){
		  var evt    = evt || window.event,
			  target = evt.target || evt.srcElement;
			  
		  if(target.className === 'xx-combox-item'){
			  var input = this.parentNode.firstChild;
			  input.value = target.firstChild.nodeValue;
			  this.isShowing = false;
			  this.style.display = '';	
		  }
		  
		  _listShowing = null;
		  /*阻止冒泡*/
		  if(evt.stopPropagation){
			  evt.stopPropagation();
		  } else {
			 evt.cancelBubble = true;  
		  }
	  };
	  
	  /*添加至渲染节点*/
	  if(this.renderElem){
	  	 this.renderElem.appendChild(ctn);
	  }	
	};
}();

/*-------------接口----------------*/

/*显示和 隐藏下拉列表*/
XX.form.ComboBox.prototype.hideList = function(){
	var itmCtn = this.domEl.childNodes[2];
	itmCtn.isShowing = false;
	itmCtn.style.display = '';
};

XX.form.ComboBox.prototype.showList = function(){
	var itmCtn = this.domEl.childNodes[2];
	itmCtn.isShowing = true;
	itmCtn.style.display = 'block';
};

XX.form.ComboBox.prototype.getValue = function(){
   return this.domEl.firstChild.value;	
}

XX.form.ComboBox.prototype.renderTo = function(elem){
	elem.appendChild(this.domEl);
};