KISSY.add('waterfallx', function(S) {
    var $ = S.Node.all, D = S.DOM,
    	COLCLASS = 'ks-waterfall-col',
    	STYLE = '.' + COLCLASS + "{ display: inline-block; vertical-align:top;"
    		  + "*display: inline; *zoom: 1}";
	
	function timedChunk(items, process, context, callback) {
        var todo = [].concat(S.makeArray(items)),
            stopper = {},
            timer;
        if (todo.length > 0) {
            timer = setTimeout(function () {
                var start = +new Date();
                do {
                    var item = todo.shift();
                    process.call(context, item);
                } while (todo.length > 0 && (+new Date() - start < 50));

                if (todo.length > 0) {
                    timer = setTimeout(arguments.callee, 25);
                } else {
                    callback && callback.call(context, items);
                }
            }, 25);
        } else {
            callback && S.later(callback, 0, false, context, [items]);
        }

        stopper.stop = function () {
            if (timer) {
                clearTimeout(timer);
                todo = [];
                items.each(function (item) {
                    item.stop();
                });
            }
        };

        return stopper;
    }
    
     function adjustItemAction(self, add, itemRaw, callback) {
        var effect = self.config.effect,
            item = $(itemRaw),     
            align = self.config.align,   
            colItems = self._colItems,
            curColHeights = self._curColHeights,
            container = self.container,
            curColCount = colItems.length,
            guard = Number.MAX_VALUE,
            col = 0;

        if (!curColCount) {
            return;
        }
            // 否则找到最短的列
        for (var i = 0; i < curColCount; i++) {
             if (curColHeights[i] < guard) {          
                  guard = curColHeights[i];             
                  col = i;               
              }
        }
        
        /*
         不在容器里，就加上
         */
        if (add) {
            // 初始需要动画，那么先把透明度换成 0
            if (effect && effect.effect) {
                // has layout to allow to compute height
                item.css("visibility", "hidden");
            }
            colItems[col].append(item);
            callback && callback();
        }

        // 加入到 dom 树才能取得高度
        curColHeights[col] += item.outerHeight(true);
        item.attr("data-waterfall-col", col);

        return item;
    }
    
    function addItem(itemRaw) {
        var self = this,
            item = adjustItemAction(self, true, itemRaw),
            effect = self.config.effect;
        // then animate
        if (effect && effect.effect) {
            // 先隐藏才能调用 fadeIn slideDown
            item.hide();
            item.css("visibility", "");
            item[effect.effect](
                effect.duration,
                0,
                effect.easing
            );
        }
    }
    
    function WaterFallX(container, config) {
    	if(!container) {
    		return;
    	}
    	
        var defaultConfig = {
            align: 'center',          
            minColCount: 1,
            effect: {
                effect:"fadeIn",
                duration:1
            }
        };

        this.config = S.merge(defaultConfig, config);
        this.container = $(container); 
   //     this._items = $('.ks-waterfall');
        this._colItems = [];   
        this._curColHeights = [];   
		this._init();
    };
    
    var privatePro = {
    	_init: function() {
    		D.addStyleSheet(STYLE, 'ks-waterfallx');
    		this._createColumnItems();
    		this.adjust();
    	},
    	/*
    	 *重新计算列数
    	 * */
    	_recalculate: function() {
        	var conf = this.config,
        		container = this.container,
            	containerWidth = container.width(),
            	colItems = this._colItems,
            	items = this._items,
    			curColHeights = this._curColHeights;
        
			// 当前列数
			conf.colWidth || (conf.colWidth = containerWidth);
			curColHeights.length = Math.max(parseInt(containerWidth / conf.colWidth), conf.minColCount);
			// 当前容器宽度
	/*		this._containerRegion = {
				width : containerWidth
			};*/
			
			//删除多余的列
			for(var i = curColHeights.length, len = colItems.length; i < len; ++i) {
				colItems[i].remove();
				colItems[i] = null;
			}
			
			S.each(curColHeights, function(v, i){
				curColHeights[i] = 0;
			});
			colItems.length = curColHeights.length;	
    	},
    	
    	_createColumnItems: function() {
    		this._recalculate();
    		
    		var conf = this.config,
    			align = conf.align,
    			colItems = this._colItems,
    			curColHeights = this._curColHeights,
    			colCount = curColHeights.length,
    			containerWidth = this.container.width();
    			
        	var margin = align === 'left' ? 0 : Math.max(containerWidth - colCount * conf.colWidth, 0);
           	 	
        	if (align === 'center') {
            	margin /= 2;
        	}
              	
        	for(var i = 0; i < colCount; ++i) {
        		colItems[i] || (colItems[i] = $('<div>').addClass(COLCLASS).appendTo(this.container));
        		colItems[i].css('marginLeft', margin);
        	}		  		
    	}
    };
    
    var pulbicPro = {
    	addItems: function(items, callback) {
    		var self = this;
                /* 正在调整中，直接这次加，和调整的节点一起处理 */
                /* 正在加，直接这次加，一起处理 */
                self._adder = timedChunk(items,
                    addItem,
                    self,
                    function () {
                        self._adder = 0;
                        callback && callback.call(self);
                        self.fire('addComplete', {
                            items:items
                        });
                    });

                return self._adder;
    	},
    	
    	isAdding: function() {
    		return !!this._adder;
    	},
    	
    	removeItem: function(item, cfg) {
			cfg = cfg || {};
			var effect = cfg.effect, 
				callback = cfg.callback,
				self = this,
				col = item.attr('data-waterfall-col');
			S.mix(cfg, {
				callback: function() {					
					item.remove();
					callback && callback.call(self);
				}
			});
			self._curColHeights[col] -= item.outerHeight(true);
			if (effect) {
				item.animate({ height : 0 }, effect.duration, effect.easing, cfg.callback);
			} else {
				cfg.callback();
			}
    	},
    	
    	destroy: function() {
    		
    	},
    	
    	isAdjusting:  function() {
    		return !!this._adjuster;
    	},
    	adjust:  function(callback) {
    		 S.log("waterfall:adjust");
                var self = this,
                    items = self.container.all(".ks-waterfall");
                /* 正在加，直接开始这次调整，剩余的加和正在调整的一起处理 */
                /* 正在调整中，取消上次调整，开始这次调整 */
                if (self.isAdjusting()) {
                    self._adjuster.stop();
                    self._adjuster = 0;
                }
                /*计算容器宽度等信息*/
                self._recalculate();     

                return self._adjuster = timedChunk(items, addItem, self, function() {
                	 self._adjuster = 0;
                     callback && callback.call(self);
                     self.fire('adjustComplete', {
                         items:items
                     });
                });
    	},
    	adjustItem: function(item) {
    		
    	}
    };
    
    S.augment(WaterFallX, S.Event.Target, privatePro, pulbicPro);
    return WaterFallX;
    
});