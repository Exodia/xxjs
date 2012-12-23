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
            console.log(self.isAdjusting())
            // 恰好 __onScroll 是 buffered . :)
            self.__onScroll();
            return;
        }
        var diff = self.config.diff;

        // 动态载
        // 最小高度(或被用户看到了)低于预加载线
        if (diff + $(win).scrollTop() + $(win).height() > self.container.outerHeight(true)) {
            S.log("waterfall:loading");
            loadData.call(self);
        }
    }

    function loadData() {
        var self = this;
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
