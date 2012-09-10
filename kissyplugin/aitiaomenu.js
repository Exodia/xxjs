KISSY.add('aitiaomenu', function(S) {
	var D = S.DOM, Event = S.Event;
	var InteractMenu = function(container, configs) {
		var ctn = D.get(container);
		if (!ctn) {
			return;
		}
		var menuConfig = eval('(' + D.attr(ctn, 'data-menu-config') + ')');
		var defaultConfig = {
			trigger : menuConfig.trigger,
			content : menuConfig.content,
			triggerType : menuConfig.type || 'click',
			activeIndex : 0
		};

		configs = this._configs = S.merge(defaultConfig, configs || {});

		this.container = ctn;
		this.triggers = D.query(configs.trigger, ctn);
		this.contents = D.query(configs.content);

		var self = this;
		Event.delegate(ctn, configs.triggerType, configs.trigger, function(evt) {
			_ontrigger.call(evt.currentTarget, self);
		});
	};
	
	function _ontrigger(menu) {
		var ind = D.data(this, 'index');
		if (!ind) {
			ind = S.indexOf(this, D.children(this.parentNode));
			D.data(this, 'index', ind);
		}
		var configs = menu._configs,
			activeIndex = configs.activeIndex;
		if(ind == activeIndex){
			return;
		}
		menu.contents[activeIndex] && D.hide(menu.contents[activeIndex]);
		D.show(menu.contents[ind]);
		//console.log(this)
		configs.activeIndex = ind;
		configs.listeners && configs.listeners.onchange(this, ind, menu);
	}

	InteractMenu.prototype = {
		constructor : InteractMenu,
		destroy : function() {
			this.container = null;
			this.triggers = null;
			this.contents = null;
		}
	};
		
	return InteractMenu;
});
