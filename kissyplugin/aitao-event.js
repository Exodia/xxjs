/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-11-23
 * Time: ����10:38
 */
KISSY.add('aitao-event', function (S) {
    "use strict";
    /**
     *
     * @param types
     * Ҫ��ʼ���ĺϷ��¼������ַ���
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
         * ע��Ϸ��¼�
         * @param types
         * �Կո�ָ����¼������ַ������磺 "event1 event2"
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
         * �����¼�
         * @param types
         * �Կո�ָ����¼������ַ������磺 "event1 event2"
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
         * �Ƴ��¼��������� detach����
         * @param types
         * @param fn
         * @param scope
         * @return {*}
         */
        off: S.EventTarget.detach,

        /**
         * ������ type ���͵��¼�������, �����������¼����������¼���������л������� eventData.
         * ���¼�δע�ᣬ���׳�����??
         * @param type(string)
         * Ҫ�������Զ����¼���??
         * @param eventData(object)
         * Ҫ���봥���¼���������ݶ���
         * @return {*}
         * �������һ���¼����������� false , �򷵻� false, ���򷵻����һ���¼��������ķ���ֵ
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