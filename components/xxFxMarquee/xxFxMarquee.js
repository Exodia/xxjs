window.XX = window.XX || {};
XX.Fx =  XX.Fx || {};


/*
走马灯构造函数；
参数elem:要进行包装的dom元素，即包装后，其内部元素会实现走马灯效果
opts:JSON格式的数据，可传入的参数包括:
	{
       speed //滚动速度，以毫秒为单位，默认为1000
	   step //滚动像素，	默认为5
	   direction //滚动方向，包括'left', 'right', 'top', 'bottom'，默认'left'
	}
*/
XX.Fx.Marquee = function(elem, opts){
	opts = opts || {};
	this.el = elem;
	this.speed = opts.speed || 1000;
	this.step  = opts.step || 5;
	var dir = this.direction = opts.direction || 'left';
	
	if( dir !== 'left' && dir !== 'right' && dir !== 'top' && dir !== 'bottom') {
		throw new Error('Constructor "XX.Fx.Marquee": direction of options must be "left","right","top","bottom"');	
	}
	
	elem.style.overflow = 'hidden';
	elem.style.whiteSpace = 'nowrap';
	if(dir === 'right' || dir === 'bottom'){
		this.step = - this.step ;	
	} 
	this.Offset = (dir === 'left' || dir === 'right') ? 'scrollLeft' : 'scrollTop';
	this.size   = parseInt((dir === 'left' || dir === 'right') ? elem.scrollWidth : elem.scrollHeight);
};

XX.Fx.Marquee.prototype.start = function(){
	if(this.timer){
		clearTimeout(this.timer);	
	}
		
	this.el.innerHTML += this.el.innerHTML;
	var that = this, speed = this.speed, step = this.step, offset = this.Offset, el = this.el, size = this.size, move = null;
	switch (this.direction){
		case 'right':
		case 'bottom':
			move = 	function(){
				if(el[offset] > 0){
					el[offset] += step;
					setTimeout(move, speed)
				} else{
					el[offset] = that.size;
					setTimeout(move, speed)	
				}	
			};	
			break;
		default:
			move = 	function(){
				if(el[offset] < size){
					el[offset] += step;
					setTimeout(move, speed)
				} else{
					el[offset] = 0;
					setTimeout(move, speed)	
				}	
			};	
	}

	this.timer = setTimeout(move, speed);
};

XX.Fx.Marquee.prototype.stop = function(){
	clearTimeout(this.timer);	
};