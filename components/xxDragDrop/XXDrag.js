/*全局命名空间*/
var XX = window.XX || {};

/*
 *XX.DragDrop组件
 * 
 * 对外提供以下方法接口：
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * enableDrag(isUsedMask): 
 * 启用拖拽，参数:isUseMask指示了是否在拖拽中使用蒙板替代拖拽元素进行拖拽
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * disable():
 * 禁止页面拖拽
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * enableDrop():
 * 允许将推拽元素放到新的位置，若新位置已有元素，则会挤出一块空间给与拖拽元素
 * 注意：此方法应在使用拖拽蒙板的情况下配合使用，不使用蒙板则无需调用该方法
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * disableDrop():
 * 禁止元素放置
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * enableOverStyle(css_obj):
 * 启用鼠标移到可拖拽元素上时显示的样式,参数css_obj可选，一个传入的字面量对象，键值分别对应元素的CSS属性和值
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * disableOverStyle():
 * 禁使用鼠标经过拖拽元素样式
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * setOverStyle(css_obj):
 * 设置鼠标经过拖拽元素样式,参数css_obj为一个传入的字面量对象，键值分别对应元素的CSS属性和值
 *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * 
 * 提供的事件接口：
 * dragEvents:
 * 一个字面量对象，包含dragstart, dragmove, dragend三个键值对
 * 每个值对应一个XX.Event对象
 * dragstart在拖拽开始时触发
 * dragmove在拖拽进行时触发
 * dragend在拖拽结束时触发
 * */
XX.DragDrop = function(){
	/*
	 * mask: 拖拽的蒙板，与拖拽元素尺寸相同
	 * targetMask:放置蒙板，即作为拖拽元素可放置位置的占位元素
	 * dragElem:若设置了isUseMask参数，则为mask元素，否则为拖拽元素
	 * sourceElem:被拖拽的元素
	 * dragdrop:提供给外部的接口对象，通过此对象的各种方法和提供的事件进行对应的操作
	 * desOffset:存储页面中所有可拖拽元素及对应的坐标信息，可拖拽元素也就是设置了dragable类的元素
	 * desTargetOffset：存储页面中所有可放置拖拽元素的元素及对应坐标信息，也就是设置了drop-target类的元素
	 * overStyle:鼠标经过拖拽元素时显示的样式
	 * useMask:与isUseMask参数相同值，为true表示用蒙板代替拖拽元素的拖动轨迹
	 * enableDraged:标识已启用拖拽，防止重复启用
	 * enableOverCSS:标识已启用拖拽元素鼠标经过样式，防止重复启用
	 * enableDroped: 标识已启用放置，防止重复启用
	 * diff:存储拖拽开始时，鼠标与元素之间的偏移信息以及元素与其相对定位的父元素信息
	 * */
	var mask, targetMask, dragElem, sourceElem;
	mask = targetMask = dragElem = sourceELem = null;
	var dragdrop = {}, desOffset = [], desTargetOffset = [], overStyle = {"border": "2px solid #00ADFE"};
		useMask = false, enableDraged = false, enableOverCSS = false, enableDroped = false;
	var diff = {x:0, y:0, parentX:0, parentY:0};
	/*对外提供的事件接口*/
	dragdrop.dragEvents = {
		"dragstart": new XX.Event("dragstart"),
		"dragmove": new XX.Event("dragmove"),
		"dragend": new XX.Event("dragend")
	};
	
	
	/*
	 *设置并存储可拖拽元素以及可放置元素坐标，以便在元素拖动时，显示合适的可放置位置
	 * */
	function calOffset(){
		var desElems = XX.getElementsByClassName("dragable");
		calOffset._set(desElems, desOffset);
		
		desElems = XX.getElementsByClassName("drop-target");
		calOffset._set(desElems, desTargetOffset);
	}
	/*保存坐标信息的辅助函数*/
	calOffset._set = function(elems, infoArr){
		var l, t, w, h;
		for(var i = elems.length -1; i > -1; --i){
			l = XX.getElemLeft(elems[i]),
			t = XX.getElemTop(elems[i]),
			w = elems[i].offsetWidth,
			h = elems[i].offsetHeight;
				
			infoArr.push({
				"elem": elems[i],
				"top": t,
				"left": l,
				"width": w,
				"height": h
			});
		}
	};
	
	/*
	 *获得坐标x,y相关的元素信息，若查找到坐标x,y所在的元素，则返回一个对象，否则返回null
	 * */
	function getInfoOffset(x, y){
		var top, left, width, height, midTop, midLeft;
		/*检测坐标是否在可拖拽元素内*/
		for(var i = desOffset.length - 1; i > -1; --i){
			left = desOffset[i].left, top = desOffset[i].top, width = desOffset[i].width, height = desOffset[i].height;
			midTop = top + height/2, midLeft = left + width/2; //圆点坐标
			
			if(x>=left && x<=midLeft){
				if(y>=top && y<=midTop){
					/*鼠标坐标在元素的第一象限内*/
					return {"desElem": desOffset[i].elem, "partion":1};
				} else if(y>midTop && y<=(top + height)){
					/*鼠标坐标在元素的第三象限内*/
					return {"desElem": desOffset[i].elem, "partion":3};
				}
			} else if(x>midLeft && x<=(left + width) ){
				if(y>=top && y<=midTop){
					/*鼠标坐标在元素的第二象限内*/
					return {"desElem": desOffset[i].elem, "partion":2};
				} else if(y>midTop && y<=(top + height)){
					/*鼠标坐标在元素的第四象限内*/
					return {"desElem": desOffset[i].elem, "partion":4};
				}
			}
		}
		
	    /*坐标不在可拖拽(dragable)元素内，则检测坐标是否在可放置(drop-target)元素内*/
		for(i = desTargetOffset.length - 1; i > -1; --i){
			left = desTargetOffset[i].left, top = desTargetOffset[i].top;
			width = desTargetOffset[i].width, height = desTargetOffset[i].height;
			
			if(x>=left && x<=(left + width) && y>=top && y<=(top + height)){
				return {"desElem": desTargetOffset[i].elem, "partion":5}
			}
		}
		
		return null;
	}
	
	/*
	 *用户拖拽事件处理函数，仅在设置了dragdrop.enableDrop时有效
	 * */
	function dragHandler(type, evt){
		switch(type){
			/*拖拽开始，设置占位蒙板的尺寸为拖拽元素的尺寸，并设置拖拽元素的透明度以提醒用户*/
			case "dragstart":
				targetMask.style.width = sourceElem.offsetWidth + 'px';
				targetMask.style.height = sourceElem.offsetHeight + 'px';
				targetMask.$sElemOpacity = XX.resetCSS(sourceElem, {
					"opacity": 0.3,
					"filter":"alpha(opacity=30)",
					"zoom": 1
				});
				 //重新计算坐标
				calOffset();
				break;
			
			/*拖拽移动，不断检测鼠标坐标以确定占位蒙板插入的位置*/	
			case "dragmove":
				if(!targetMask.isShowed){
					targetMask.style.display = 'block';
					targetMask.isShowed = true;
				}
				
				var desInfo  = getInfoOffset(evt.x, evt.y),
					desElemP = desElem = null;
				if(desInfo != null){
					desElem = desInfo.desElem;
					switch(desInfo.partion){
						/*鼠标坐标在元素的上半部分，即第一或者第二象限，则插入在元素的前面*/
						case 1:
						case 2:
							desElemP = XX.getParentByClassName(desInfo.desElem, "drop-target");
							if(desElemP !== null){
								desElemP.insertBefore(targetMask, desElem);
								targetMask.style.display = "block";
							}
							
							break;
						/*在下半部分，则插入到元素之后*/
						case 3:
						case 4:
							desElemP = XX.getParentByClassName(desInfo.desElem, "drop-target");
							if(desElemP !== null){
								desElemP.insertBefore(targetMask, XX.next(desElem));
								targetMask.style.display = "block";
							}
						
							break;
						/*在可放置元素上*/
						case 5:
							desElem.appendChild(targetMask);
							targetMask.style.display = "block";
							break;
					}
				}
					
				break;
			/*拖拽结束，放置拖拽元素，直接将拖拽元素替代占位蒙板节点即可，因为节点树的变更，清空坐标信息*/
			case "dragend":
				XX.setCSS(sourceElem, targetMask.$sElemOpacity);
				var par = targetMask.parentNode;
				if(par){
					par.replaceChild(sourceElem, targetMask);
				}
				desOffset = [], desTargetOffset = [];
				break;
		}
	}
	
	/*在IE浏览器下，禁止选择页面文本*/
	function ieDisableSelect(evt){
		evt = evt || window.event;
		if(evt.preventDefault){
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	}
	
	/*非IE浏览器下，禁止选择页面文本*/
	function disableSelect(){ 
		dragdrop.$oldBodyStyle = XX.resetCSS(document.body,   //FF/Chrome
			{'mozUserSelect':'none', 'webkitUserSelect': 'none', 'userSelect': 'none'});
		
		XX.addEvent(document.body, 'selectstart', ieDisableSelect);
	}
	
	/*恢复初始的页面选择文本设置*/
	function resetSelect(){ //恢复初始选择
		XX.resetCSS(document.body, dragdrop.$oldBodyStyle);
		XX.removeEvent(document.body, 'selectstart', ieDisableSelect);
	}
	
	/*底层事件处理函数*/
	function handleEvent(event){
		event = event || window.event;
		var tgt = event.target || event.srcElement;
		switch(event.type){
			
			case 'mousedown':
			/*鼠标按下，对于非dragable和drag-parent元素，直接返回*/
				if(tgt.className.indexOf('dragable') === -1 && tgt.className.indexOf('drag-parent') === -1){
					return;
				}
				
				/*禁止页面选择文字，以免拖拽时选中文本导致事件丢失*/
				disableSelect();
				
				/*根据元素的类名计算对应的初始坐标*/
				if(tgt.className.indexOf('dragable') !== -1){
					sourceElem = dragElem = tgt;
					diff.x = event.clientX - XX.getElemLeft(tgt);
					diff.y = event.clientY - XX.getElemTop(tgt);
					diff.parentX = XX.getElemLeft(tgt.offsetParent);
					diff.parentY = XX.getElemTop(tgt.offsetParent);
				} else if(tgt.className.indexOf('drag-parent') !== -1){
					sourceElem = dragElem = tgt.parentNode;
					diff.x = event.clientX - XX.getElemLeft(sourceElem);
					diff.y = event.clientY - XX.getElemTop(sourceElem);
					diff.parentX = XX.getElemLeft(sourceElem.offsetParent);
					diff.parentY = XX.getElemTop(sourceElem.offsetParent);
				}
				
				/*
				 使用蒙板，则拖动元素为蒙板
				 * */
				if(useMask){
					if(null === mask){
						mask = document.createElement("div");
						mask.style.cssText = "position:absolute; display:none; background-color:blue; opacity:0.6; zoom:1;" +
		 					"filter:alpha(opacity=60);";
		 				document.body.appendChild(mask);
		 			}
		 			mask.style.width = sourceElem.offsetWidth + 'px';
					mask.style.height = sourceElem.offsetHeight + 'px';
		 			dragElem = mask;
		 			diff.parentX = diff.parentY = 0;
				}
				
				/*触发用户拖拽开始事件*/
				dragdrop.dragEvents.dragstart.fire({target:sourceElem, x:event.clientX, y:event.clientY});
				
				break;
				
			case 'mousemove':
			/*鼠标移动，若未开始拖拽，即dragElem为null，此时直接返回*/
				if(dragElem == null){
					return;
				}
				
				/*若使用了拖拽蒙板，则在移动中改变蒙板坐标，否则直接改变拖拽元素坐标*/
				if(mask !== null){
					mask.style.left = event.clientX - diff.x  + 'px';
					mask.style.top = event.clientY - diff.y + 'px';
					if(!mask.isShowed){
						mask.style.display = 'block';
						mask.isShowed = true;
					}
				} else {
					dragElem.style.left = event.clientX - diff.x - diff.parentX + 'px';
					dragElem.style.top = event.clientY - diff.y - diff.parentY + 'px';
				}
				/*触发拖拽移动事件*/
				dragdrop.dragEvents.dragmove.fire({target:sourceElem, x:event.clientX, y:event.clientY});
				
				break;
				
			case 'mouseup':
			/*未进行拖拽，即sourceElem为null，则返回*/
				if(sourceElem === null){
					return;
				}
				
				/*恢复页面初始的文本选择设置*/
				resetSelect();
				/*隐藏拖拽蒙板*/
				if(mask !== null){
					mask.style.display = 'none';
					mask.isShowed = false;
				}
				/*触发拖拽放置事件*/
				dragdrop.dragEvents.dragend.fire({target:sourceElem, x:event.clientX, y:event.clientY});
				/*接触元素引用*/
				sourceElem = dragElem = null;
				break;
		}
	}
	
	/*
	 *允许拖拽
	 * 参数:isUseMask指示了是否在拖拽中使用蒙板替代拖拽元素进行拖拽
	 * 参数:overCSS为一字面量对象，每个元素键值对应着鼠标经过可拖拽元素时的CSS样式
	 * */
	dragdrop.enableDrag = function(isUseMask, overCSS){
		if(enableDraged){/*已经启用，则返回*/
			return;
		}
		
		useMask = isUseMask;
		enableDraged = true;
		if(typeof overCSS === 'object'){
			dragdrop.enableOverStyle(overCSS);
		}
		XX.addEvent(document, 'mousedown', handleEvent);
		XX.addEvent(document, 'mousemove', handleEvent);
		XX.addEvent(document, 'mouseup', handleEvent);
	};
	
	/*
	 *允许将推拽元素放到新的位置，若新位置已有元素，则会挤出一块空间给与拖拽元素
	 * */
	dragdrop.enableDrop = function(){
		if(enableDroped){/*已经启用，则返回*/
			return;
		}
		/*仅在使用蒙板的情况下起作用*/
		if(!useMask){
			return;
		}
		
		if(targetMask == null){
			targetMask = document.createElement("div");
			targetMask.style.cssText = "position:relative; display:none; border:2px dotted;"
		}
		
		var dragEvents = dragdrop.dragEvents;
		dragEvents.dragstart.addHandler(dragHandler);
		dragEvents.dragmove.addHandler(dragHandler);
		dragEvents.dragend.addHandler(dragHandler);
		enableDroped = true;
	};
	
	/*禁止元素放置*/
	dragdrop.disableDrop = function(){
		var dragEvents = dragdrop.dragEvents;
		dragEvents.dragstart.removeHandler(dragHandler);
		dragEvents.dragmove.removeHandler(dragHandler);
		dragEvents.dragend.removeHandler(dragHandler);
		enableDroped = false;
	};
	
	/*禁止页面拖拽*/
	dragdrop.disable = function(){
		XX.removeEvent(document, 'mousedown', handleEvent);
		XX.removeEvent(document, 'mousemove', handleEvent);
		XX.removeEvent(document, 'mouseup',  handleEvent);
		dragdrop.disableOverStyle();
		enableDraged = false;
	};
	
	/*启用鼠标移到可拖拽元素上时显示的样式*/
	dragdrop.enableOverStyle = function(css_obj){
		if(enableOverCSS){
			return;
		}
		
		overStyle = css_obj || overStyle; //未传入css_obj，则使用默认样式
		$oldCSS = null;//存储原有样式
		/*mouseover监听函数，移入鼠标，根据参数设置样式*/
		dragdrop.enableOverStyle._over = function(evt){
			evt = evt || window.event;
			var tgt = evt.target || evt.srcElement,
			elem = null;
		
			if(XX.hasClass(tgt, "dragable")){
				elem = tgt;
			} else if(XX.hasClass(tgt, "drag-parent")){
				elem = tgt.parentNode;
			}
		
			if(elem !== null){
				$oldCSS = XX.resetCSS(elem, overStyle);
			}
		}
		/*mouseout监听函数，移除鼠标则恢复原有样式*/
		dragdrop.enableOverStyle._out = function(evt){
			evt = evt || window.event;
			var tgt = evt.target || evt.srcElement,
				elem = null;
		
			if(XX.hasClass(tgt, "dragable")){
				elem = tgt;
			} else if(XX.hasClass(tgt, "drag-parent")){
				elem = tgt.parentNode;
			}

			if(elem !== null && $oldCSS !== null){
				XX.setCSS(elem, $oldCSS);
				$oldCSS = null;
			}
		}
		
		XX.addEvent(document, "mouseover", dragdrop.enableOverStyle._over);
		XX.addEvent(document, "mouseout", dragdrop.enableOverStyle._out);
		enableOverCSS = true;
	};
	
	/*禁用鼠标经过拖拽元素样式*/
	dragdrop.disableOverStyle = function(){
		XX.removeEvent(document, "mouseover", dragdrop.enableOverStyle._over);
		XX.removeEvent(document, "mouseout", dragdrop.enableOverStyle._out);
		enableOverCSS = false;
	};
	
	/*设置鼠标经过拖拽元素样式*/
	dragdrop.setOverStyle = function(css_obj){
		if(typeof css_obj !== 'object'){
			return;
		}
		
		overStyle = css_obj;
	};
	
	return dragdrop;
}();