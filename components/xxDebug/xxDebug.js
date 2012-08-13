/*
 *XX.Debug命名空间，主要用来输出一些调试信息
 * */
window.XX || (window.XX = {});
XX.Debug = function() {
	var toolbar = null, infoList = null, closeBtn = null, debugged = false, useConsole = false, eventTypes = {};

	function showInfo(evt) {
		evt = evt || window.event;
		var tgt = evt.target || evt.srcElement, infoStr = XX.Debug.getBubbleTreeText(tgt);

		if(useConsole) {
			console.log(infoStr);
		} else {
			var infoHTML = '<li style="border:1px dotted green;border-bottom:none;font-weight:bolder;text-align:center">' + '触发事件：' + evt.type + '</li><li style="border:1px dotted green">' + infoStr + '</li>';

			if(null === toolbar) {
				toolbar = document.createElement('div');
				toolbar.style.cssText = "position:fixed;bottom:0;left:0;height:80px;width:100%;overflow:auto;" + "font-size:10px;border:5px solid green;";
				toolbar.onclick = toolbar.ondblclick = toolbar.onmousedown = toolbar.onmouseup = toolbar.onmouseover = toolbar.onfocus = toolbar.onblur = toolbar.onkeydown = toolbar.onkeypress = toolbar.onkeyup = function(event) {
					event = event || window.event;
					if(event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelBubble = true;
					}
				};

				infoList = document.createElement('ul');
				infoList.style.listStyle = "none";
				infoList.innerHTML = infoHTML;
				closeBtn = document.createElement('input');
				closeBtn.type = "button";
				closeBtn.value = '关闭';
				closeBtn.style.cssText = "position:relative;left:45%;top:0;display:block";
				closeBtn.onclick = function(event) {
					toolbar.style.display = "none";
					XX.Debug.disable();
				};

				toolbar.appendChild(infoList);
				toolbar.appendChild(closeBtn);
				document.body.appendChild(toolbar);
			} else {
				infoList.innerHTML += infoHTML;
				toolbar.style.display = "block";
			}
		}
	}

	var debug = {
		"enable" : function(isUseConsole) {
			useConsole = isUseConsole || false;
			debugged = true;
		},
		"disable" : function() {
			debugged = false;
			if(toolbar !== null) {
				toolbar.style.display = "none";
				for(var k in eventTypes) {
					if(eventTypes.hasOwnProperty(k)) {
						this.removeEvent(k);
					}
				}
				eventTypes = {};
			}
		},

		"getBubbleTree" : function(elem) {
			if(elem === document) {
				return;
			}
			var info = [];
			info.push({
				"tag" : elem.nodeName,
				"left" : XX.getElemLeft(elem),
				"top" : XX.getElemTop(elem),
				"width" : elem.offsetWidth,
				"height" : elem.offsetHeight
			});

			for(var par = elem.parentNode; par && par !== document; par = par.parentNode) {
				info.push({
					"tag" : par.nodeName,
					"left" : XX.getElemLeft(par),
					"top" : XX.getElemTop(par),
					"width" : elem.offsetWidth,
					"height" : elem.offsetHeight
				});
			}
			return info;
		},

		"getBubbleTreeText" : function(elem) {
			var strArr = [], str, info = this.getBubbleTree(elem);

			for(var i = 0, len = info.length; i < len; ++i) {
				str = elem.nodeName + '{相对页面的坐标为:(' + XX.getElemLeft(elem) + ', ' + XX.getElemTop(elem) + ')' + '，尺寸为:(' + elem.offsetWidth + ', ' + elem.offsetHeight + ')';
				strArr.push(str);
			}
			return strArr.join(">>>>");
		},

		"listenEvent" : function(eventType) {
			if(debugged && !eventTypes[eventType]) {
				eventTypes[eventType] = true;
				XX.addEvent(document, eventType, showInfo, false);
			}
		},

		"removeEvent" : function(eventType) {
			if(eventTypes[eventType]) {
				XX.removeEvent(document, eventType, showInfo, false);
				delete eventTypes[eventType];
			}
		},

		"showOffset" : function(elem) {
		},
		"showSize" : function(elem) {
		}
	};

	return debug;
}();