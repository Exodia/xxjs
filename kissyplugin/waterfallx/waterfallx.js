KISSY.add('waterfallx/base', function(S) {
    var $ = S.Node.all, 
    	D = S.DOM, 
    	win = S.Env.host || window,
    	COLCLASS = 'ks-waterfall-col',
    	RESIZE_DURATION = 50,
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
            container = self.container,
            curColCount = colItems.length,
            guard = Number.MAX_VALUE,
            col = 0;

        if (!curColCount) {
            return;
        }
            // 否则找到最短的列
        for (var i = 0; i < curColCount; i++) {
        	var height = colItems[i].outerHeight(true);
             if ( height < guard) {          
                  guard = height;             
                  col = i;               
              }
        }
        
         /*
         	不在容器里，就加上
         */
       
		if (add && effect && effect.effect) {
			// 初始需要动画，那么先把透明度换成 0
			// has layout to allow to compute height
			item.css("visibility", "hidden");
		}
		
		colItems[col].append(item);
		callback && callback();

        // 加入到 dom 树才能取得高度
     //   curColHeights[col] += item.outerHeight(true);
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
    
     function doResize() {
        var containerRegion = this._containerRegion;
        // 宽度没变就没必要调整
        if (containerRegion && this.container.width() === containerRegion) {
            return
        }
        this.adjust();
    }
    
    function WaterFallX(config) {
    	if(!config.container) {
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
        this.container = $(config.container); 
        this._colItems = [];   
		this._init();
    };
    
    var privatePro = {
    	_init: function() {
    		D.addStyleSheet(STYLE, 'ks-waterfallx');
    		this._createColumnItems();
    		this.addItems(this.container.all(".ks-waterfall"));
    		this.__onResize = S.buffer(doResize, RESIZE_DURATION, this);
            $(win).on("resize", this.__onResize);
    	},
    	/*
    	 *重新计算列数
    	 * */
    	_calculate: function() {
        	var conf = this.config,
        		container = this.container,
            	containerWidth = container.width(),
         //   	colItems = this._colItems,
            	colCount;
        
			// 当前列数
			conf.colWidth || (conf.colWidth = containerWidth);
			colCount = Math.max(parseInt((containerWidth - 1) / conf.colWidth), conf.minColCount);
			// 当前容器宽度
			this._containerRegion = containerWidth;		
			
			
			
			return colCount;
			
			//colItems.length = colCount;	
    	},
    	
    	_createColumnItems: function() {			
    		var conf = this.config,
    			align = conf.align,
    			colItems = this._colItems,
    			colCount = this._calculate(),
    			containerWidth = this.container.width();
    		
    		
    		//减1是因为，在width设置为百分比的情况下，系统会对小数位四舍五入，因此这里减少1像素
        	var margin = align === 'left' ? 0 : Math.max(containerWidth - 1 - colCount * conf.colWidth, 0);
           	margin = margin/colCount;
        	if (align === 'center') {
            	margin /= 2;
        	}
        	
        	//删除多余的列
			for(var i = colCount, len = colItems.length; i < len; ++i) {
				colItems[i].remove();
				colItems[i] = null;
			}
        	
        	colItems.length = colCount;
        	
        	for(var i = 0; i < colCount; ++i) {
        		colItems[i] || (colItems[i] = $('<div>').addClass(COLCLASS).appendTo(this.container));     		
        		colItems[i].width(conf.colWidth).css('marginLeft', margin);
        	}		  		
    	},
    	
    	_adjustMargin: function() {
    		var conf = this.config,
    			align = conf.align,
    			colItems = this._colItems,
    			colCount = colItems.length,
    			containerWidth = this.container.width();
    			
        	var margin = align === 'left' ? 0 : Math.max(containerWidth - colCount * conf.colWidth, 0);
           	margin /= colCount;
        	if (align === 'center') {
            	margin /= 2;
        	}
        
        	for(var i = 0; i < colCount; ++i) {      		   		
        		colItems[i].width(conf.colWidth).css('marginLeft', margin);
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
                   //     self._adjustMargin();
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

			if (effect) {
				item.animate({ height : 0 }, effect.duration, effect.easing, cfg.callback);
			} else {
				cfg.callback();
			}
    	},
    	
    	destroy: function() {
    		$(win).detach("resize", this.__onResize);
    	},
    	
    	isAdjusting:  function() {
    		return !!this._adjuster;
    	},
    	adjust:  function(callback) {
    		 S.log("waterfall:adjust");
                var self = this,
                	itemSort = [],
                	colItems = this._colItems,
                	colCount = colItems.length,
                    items = this.container.all('.ks-waterfall'),
                //	items = new Array(colCount),
                	i, j, max;
                
                 if (self.isAdjusting()) {
                    self._adjuster.stop();
                    self._adjuster = 0;
                 }

        /*        for(i = 0; i < colCount; ++i) {
                	//items[i] = colItems[i].all(".ks-waterfall");
                	if(!max || max < colItems[i].clientHeight) {
                		//找到最长列数
                		max = i;
                	}
                }*/
                            
                /* 正在加，直接开始这次调整，剩余的加和正在调整的一起处理 */
                /* 正在调整中，取消上次调整，开始这次调整 */
               
                
                //横竖交换
             /*   for(i = 0; i < max; ++i) {
                	for(j = 0; j < colCount; ++j) {
                		items[j][i] && itemSort.push($(items[j][i]));
                	}                          	
                }*/
               
               	 /*重新计算列*/
                self._createColumnItems();
                colCount = colItems.length;
                for(i = 0; i < colCount; ++i) {
                //    colItems[i].remove();
                }     
                
                var num = items.length;
                function check() {
                	--num;
                	if( num <= 0) {               		
                		self._adjuster = 0;
                //		self._adjustMargin();
                    	callback && callback.call(self);          
                    	self.fire('adjustComplete', {
                        	items:items
                    	});
                	}
                }
                     
                return self._adjuster = timedChunk(items, function(item){
                	 adjustItemAction(self, false, item, check);
                });			            
    	},
    	adjustItem: function(item) {
    		
    	}
    };
    
    S.augment(WaterFallX, S.Event.Target, privatePro, pulbicPro);
    return WaterFallX;
});


/*
 Loader
 * */
KISSY.add("waterfallx/loader", function (S, Node, Waterfall) {

    var $ = Node.all,
        win = S.Env.host || window,
        SCROLL_TIMER = 50;

    
    function Loader() {
        Loader.superclass.constructor.apply(this, arguments);
        this.config.diff || (this.config.diff = 0);
    }

    function doScroll() {
        var self = this;
        S.log("waterfall:doScroll");
        if (self.__loading || !self.__started) {
            return;
        }
        // 如果正在调整中，等会再看
        // 调整中的高度不确定，现在不适合判断是否到了加载新数据的条件
        if (self.isAdjusting()) {
            // 恰好 __onScroll 是 buffered . :)
            self.__onScroll();
            return;
        }
        var colItems = self._colItems,
            diff = self.config.diff;         
       
        // 动态载
        // 最小高度(或被用户看到了)低于预加载线
        if (diff + $(win).scrollTop() + $(win).height() > self.container.outerHeight(true)) {
            S.log("waterfall:loading");
            loadData.call(self);
        }
    }

    function loadData() {
        var self = this,
            container = self.container;

        self.__loading = 1;

        var load = self.config.load;
        load && load(success, end);

        function success(items, callback) {
            self.__loading = 0;
            self.addItems(items, callback);          
        }

        function end() {
            self.end();
        }
    }

    S.extend(Loader, Waterfall,
        /**
         * @lends Waterfall.Loader#
         */
        {
            _init:function () {
                var self = this;
                Loader.superclass._init.apply(self, arguments);
                self.__onScroll = S.buffer(doScroll, SCROLL_TIMER, self);
                // 初始化时立即检测一次，但是要等初始化 adjust 完成后.
                self.__onScroll();
                self.start();
            },              

            /**
             * Start monitor scroll on window.
             * @since 1.3
             */
            start:function () {
                var self = this;
                if (!self.__started) {
                    $(win).on("scroll", self.__onScroll);
                    self.__started = 1;
                }
            },

            /**
             * Stop monitor scroll on window.
             */
            end:function () {
                $(win).detach("scroll", this.__onScroll);
                self.__started = 0;
            },

            /**
             * Use end instead.
             * @deprecated
             */
            pause:function () {
                this.end();
            },

            /**
             * Use start instead.
             * @deprecated
             */
            resume:function () {
                this.start();
            },

            /**
             * Destroy this instance.
             */
            destroy:function () {
                var self = this;
                Loader.superclass.destroy.apply(self, arguments);
                $(win).detach("scroll", self.__onScroll);
                self.__started = 0;
            }
        });

    return Loader;

}, {
    requires:['node', './base']
});


KISSY.add("waterfallx", function (S, WaterfallX, Loader) {
    WaterfallX.Loader = Loader;
    return WaterfallX;
}, {
    requires:['waterfallx/base', 'waterfallx/loader']
});