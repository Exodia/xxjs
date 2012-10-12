KISSY.add('waterfallx', function(S, Node) {
    var $ = Node.all;

    var WaterFall = function(config) {
        var defaultConfig = {
            align: 'center',
            minColCount: 1,
            colWidth: 1,
            colCount: 1,
            effect: {
                effect:"fadeIn",
                duration:1
            }
        };

        config = S.merge(defaultConfig, config);


    }
}, {
      requires: ['node']
});