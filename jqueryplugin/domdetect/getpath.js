/*获取元素在DOM树中的路径，以“标签名$索引位置>标签名$索引位置“的字符串返回
 *参数elem:计算路径的元素
 * 参数root: 路径开始的节点,默认为body,最高也为body
 * */
XX.path = function(elem, root){
	var ret = [],
		body = document.body,
		root = root || body;
	while(elem !== root && elem !== body){
		ret.unshift(elem.nodeName.toLowerCase() + '$' + XX.indexTag(elem));
		elem = elem.parentNode;
	}
	
	return ret.join('>')
};

/*获取元素在DOM树中相同标签节点的位置索引*/
XX.indexTag = function(elem){
	var name = elem.nodeName.toLowerCase(),i;
	if(name === 'body' || name === 'html'){
		return 0;
	}
	var elems = elem.parentNode.getElementsByTagName(name);
	for(i = elems.length - 1; i > -1; --i){
		if(elem === elems[i]){
			return i;
		}
	}
}