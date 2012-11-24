/**
 * Created with JetBrains WebStorm.
 * User: 踏风
 * Date: 12-11-13
 * Time: 下午6:13
 * To change this template use File | Settings | File Templates.
 */
//等比例缩小图片元素

(function(){
    var resize = function (el, to, sizes) {
        var maxSize = sizes.maxSize,
            maxProp = sizes.maxProp,
            style = el.style;


        if (maxSize >= to) {
            scale = to / maxSize;
            style[maxProp] = to + 'px';
            style[sizes.prop] =  sizes.size * scale + 'px';
        }
    };

    /**
     *
     * @param el
     * 待调整的img元素
     * @param to
     * 需要缩小到的尺寸，若原始的width和height都小于to，则不做改变
     * @param cb
     * 成功时的回调函数，会传入el作为参数
     * @param error
     * 错误时的回调函数，会传入el作为参数
     */
    var imageShrink = function (el, to, cb, error) {
        var img = new Image(),
            originWidth, originHeight, maxProp, prop;

        img.src = el.src;
        function _calculate() {
            originWidth = img.width;
            originHeight = img.height;
            maxProp = originHeight > originWidth ? 'height' : 'width';
            prop = maxProp == 'height' ? 'width' : 'height';
        }

        if (img.complete) {
            _calculate();
            resize(el, to, {maxProp:maxProp, maxSize: img[maxProp], prop:prop, size:img[prop]});
            cb && cb(el);
        } else {
            img.onload = function () {
                _calculate();
                resize(el, to, {maxProp:maxProp, maxSize: img[maxProp], prop:prop, size:img[prop]});
                this.onload = null;
                cb && cb(el);
            };
            img.onerror = function () {
                this.onload = this.onerror = null;
                error && error(el);
            }
        }
    };

    window.XX = window.XX || {};
    XX.imageShrink = imageShrink;
    return imageShrink;
}());