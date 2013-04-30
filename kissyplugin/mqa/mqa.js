;
KISSY.add(function () {
    var aliasMap = {}

    var wrapMqlFn = function (mql, fn) {
        var wrap = function () {
            fn.apply(this, arguments)
        }

        mql.addListener(wrap)

        return wrap
    }

    var mqa = {
        /**
         * ��Ӽ���ӳ��
         * @param {String} alias Ҫӳ��ļ���
         * @param {String} media Ҫ��ӳ���ý���ѯ��
         * @return this;
         * @example
         * mqa.add("landscape", "(orientation: landscape)");
         */
        add: function (alias, media) {
            if (alias in aliasMap) {
                throw new Error(alias + " has already been added!")
            }

            aliasMap[alias] = {
                media: media,
                mql: null,
                handlers: [],
                wraps: []
            }

            return this
        },

        /**
         * �Ƴ�����ӳ��
         * @param {String} alias Ҫ�Ƴ��ļ���
         * @return {Boolean} �Ƿ��Ƴ��ɹ�
         */
        remove: function (alias) {
            this.off(alias)

            return delete aliasMap[alias]
        },

        /**
         * ����ý���ַ����仯�¼�
         * @param {String} alias
         * ý���ѯ����,����ý���ѯ�ַ���
         * @param {function(matches)} fn
         * ý���ַ����仯�¼���Ӧ������ �ᴫ��һ������ֵ������
         * ��ʾ�Ƿ��������ý���ѯ�ַ���ƥ��
         * @param {boolean} execAtOnce
         * �Ƿ�����ִ��һ�μ���������һ�����ڳ�ʼ����ʱ��
         * @return this
         * @example
         * mqa.on("landscape", function(matches) {
         *	 //���matchesֵ����������Ҫ���β���
         * });
         */
        on: function (alias, fn, execAtOnce) {
            //�����������ڣ�����ý���ѯ�ַ���
            if (!(alias in aliasMap)) {
                aliasMap[alias] = {
                    media: alias,
                    mql: window.matchMedia(alias),
                    handlers: [],
                    wraps: []
                }
            }

            var aliasObj = aliasMap[alias],
                mql = aliasObj.mql,
                handlers = aliasObj.handlers

            var wrapFn

            if (handlers.indexOf(fn) > -1) {
                execAtOnce && fn(mql)
                return this
            }

            wrapFn = wrapMqlFn(mql, fn)
            handlers.push(fn)
            aliasObj.wraps.push(wrapFn)

            execAtOnce && fn(mql)

            return this
        },

        /**
         * �Ƴ�ý���ַ����仯�����¼�
         * @param alias Ҫ�Ƴ��ļ���
         * @param {function} fn ��ѡ����δ���룬���Ƴ��ü����������¼�����ʱ�ȼ���remove����
         * �����Ƴ���Ӧ�ļ�������
         * @return {Boolean} �����Ƿ�ɹ��Ƴ�
         */
        off: function (alias, fn) {
            if (!(alias in aliasMap)) {
                return false
            }

            var aliasObj = aliasMap[alias]

            var mql, wraps, handlers

            mql = aliasObj.mql
            wraps = aliasObj.wraps
            handlers = aliasObj.handlers

            //δ����fn��fn��Ϊ���������Ƴ������¼���������
            if (typeof fn !== 'function') {
                wraps.forEach(function (wrap) {
                    mql.removeListener(wrap)
                })

                return true
            }


            //�ҵ���غ���
            var index = handlers.indexOf(fn)
            if (index > -1) {
                mql.removeListener(wraps[index])

                handlers.splice(index, 1)
                wraps.splice(index, 1)
            }

            return true

        },


        /**
         * ���Ե�ǰ������Ƿ���ϼ�����ָ���ý���ѯ������
         * @param {String} alias ý�������ý���ѯ�ַ���
         * @returns {Boolean|} �����Ƿ�ƥ���Ӧ�ļ���
         * @example
         * mqa.add("landscape", "(orientation: landscape");
         * mqa.match("landscape"); // => true or false
         */
        match: function (alias) {
            return  (alias in aliasMap && aliasMap[alias].mql.matches) ||
                window.matchMedia(alias).matches
        }
    }

    return mqa
})