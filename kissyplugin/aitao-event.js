/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-11-23
 * Time: 上午10:38
 */
KISSY.add('aitao-event', function (S) {
    "use strict";
    /**
     *
     * @param types
     * 要初始化的合法事件类型字符串
     * @return {*}
     * @constructor
     */
    var EventProxy = function (types) {
        if (!(this instanceof EventProxy)) {
            return new EventProxy(types);
        }
        this._supportEvents = { };
        S.isString(types) && this.regEvents(types);
    };

    S.augment(EventProxy, S.EventTarget,{
        /**
         * 注册合法事件
         * @param types
         * 以空格分隔的事件类型字符串，如： "event1 event2"
         */
        regEvents:function (types) {
            if (!S.isString(types)) {
                throw new Error("expect 'String' type for the argument!");
            }

            types = types.split(/\s+/);
            for (var i = types.length - 1; i > -1; --i) {
                this._supportEvents[types[i]] = true;
            }
        },

        /**
         * 撤销事件
         * @param types
         * 以空格分隔的事件类型字符串，如： "event1 event2"
         */
        unRegEvents: function(types) {
            if (!S.isString(types)) {
                throw new Error("expect 'String' type for the argument!");
            }

            types = types.split(/\s+/);
            for (var i = types.length - 1; i > -1; --i) {
                this._supportEvents[types[i]] = null;
            }
        },

        /**
         * 移除事件处理器， detach别名
         * @param types
         * @param fn
         * @param scope
         * @return {*}
         */
        off: S.EventTarget.detach,

        /**
         * 触发绑定 type 类型的事件处理器, 并给触发的事件处理器的事件对象参数中混入数据 eventData.
         * 若事件未注册，则抛出错误??
         * @param type(string)
         * 要触发的自定义事件名??
         * @param eventData(object)
         * 要混入触发事件对象的数据对象
         * @return {*}
         * 如果其中一个事件处理器返回 false , 则返回 false, 否则返回最后一个事件处理器的返回值
         */
        fire: function(type, eventData) {
            if(!this._supportEvents[type]) {
                throw new Error('unsupported event:' + ' ' + type);
            }

            return S.EventTarget.fire.call(this, type, eventData);
        }
    });
    return EventProxy;
});