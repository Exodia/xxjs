#What's this?
就是个waterfallx，与kissy最大的不同是，采用了inline-block布局，而未采用KISSY的绝对定位布局
#优点
1. 容器无需定高；
2. adjust的平均效率会更高
3. 支持在瀑布流头部插入数据，这可以通过调用preAddItems
4. API兼容KISSY，并多了一个preAddItems用于前向插入数据
#适用场景
图片尺寸未知且需要自适应
线上案例：
1. [淘宝周边](http://zhoubian.taobao.com)
2. [有图有真相](http://www.taobao.com/go/act/sale/zhenxiang.php)
#其他
preAddItems的参数与addItems一致！
配套的图片自适应组件可见：https://github.com/Exodia/xxjs/util/imageshrink
