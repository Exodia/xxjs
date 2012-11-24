(function(){
    XX = window.XX || { };
    function randomNum(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    XX.randomSeq = function(num, from, to) {
        var hash = { },
            ret = [],
            count = 0,
            n;
        while(count < num) {
            n = randomNum(from, to);
          //  n = Math.floor(Math.random() * (to - from + 1)) + from;
            if(!hash[n]) {
                hash[n] = n;
                ++count;
            }
        }

        for(var k in hash){
            ret.push(hash[k]);
        }

        return ret;
    };
})();