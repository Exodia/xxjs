/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-11-23
 * Time: 下午12:08
 */
void function() {
  var S = KISSY;
    S.config({
        debug : true,
        packages : [{
            name : "aitao", //包名
            //	tag : "20120907", //时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
            path : "../", //包对应路径, 相对路径指相对于当前页面路径
            charset : "utf-8" //包里模块文件编码格式
        }]
    });
    S.use('aitao-event', function(S, EventProxy){
        px = EventProxy();
        e =  EventProxy;
        px.regEvents('fuck1 fuck2 fuck3');
        px.on('fuck1 fuck2 fuck3 fuck4', function(ev) {
            console.log(ev.type);
        });

        px.fire('fuck1', {fuck:'fuck1', $fuck:'$fuck1'});
        px.fire('fuck2',{fuck:'fuck2', $fuck:'$fuck2'});
        px.fire('fuck3');
        //will throw error!
    //    px.fire('fuck4');
        px.off('fuck2 fuck3');
        px.fire('fuck1', {fuck:'fuck1', $fuck:'$fuck1'});
        px.fire('fuck2',{fuck:'fuck2', $fuck:'$fuck2'});
        px.fire('fuck3');

    });
}();