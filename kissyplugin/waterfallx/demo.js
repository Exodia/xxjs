KISSY.ready(function(S){
	var tpl = S.get('#tpl').innerHTML;
	var items = [];
	var ctn = S.all('#container')
	for(var i = 0; i < 15; ++i) {		
		items.push(S.all(tpl));						
	}
	
	
	
	/*S.config({
			debug : true,
			packages : [{
				name:'',
				
				path : "./"
			}]
	});*/
	
	S.use('waterfall', function(S, WaterFall){
		wf = new WaterFall({
			colWidth:230,
			container: '#container'
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
