KISSY.ready(function(S){
	var tpl = S.get('#tpl').innerHTML;
	var items = [];
	var ctn = S.all('#container')
	for(var i = 0; i < 15; ++i) {		
		items.push(S.all(tpl));						
	}
	
	
	
	S.config({
			debug : true,
			packages : [{
				name:'',
				//	tag : "20120907", //时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
				path : "./"//包对应路径, 相对路径指相对于当前页面路径
			}]
	});
	
	S.use('waterfallx', function(S, WaterFall){
		wf = new WaterFall('#container',{
			colWidth:230
		});
		
		wf.addItems(items);
		function resize() {
			S.each(items, function(v){
			v.height(parseInt( 230 + Math.random()*60));
		})
		}
		
		setTimeout(resize, 5000)
	});
})
