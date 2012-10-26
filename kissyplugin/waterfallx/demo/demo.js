KISSY.ready(function(S) {
	var tpl = S.get('#tpl').innerHTML;
	var items = [];
	var ctn = S.all('#container')
	for (var i = 0; i < 15; ++i) {
		items.push(S.all(tpl));
	}

	S.use('waterfallx, template', function(S, WaterFall, Template) {
		var nextPage = 0;
		wf = new WaterFall.Loader({
			colWidth : 250,
			container : '#container',
			load : function(success, end) {
				S.io.get('data.json', {nextPage:nextPage}, function(data) {
					var items = [];
					S.each(data.items, function(item) {
						//随机高度
						item.height = parseInt(250 + Math.random() * 60)
						items.push(S.all(Template(tpl).render(item)));
					});
					success(items);
					(++nextPage > data.total) && end();
					console.log('nextPage', nextPage)
				})		
			}
		});
	});
})
