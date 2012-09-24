KISSY.add('aitao-placeholder', function(S) {
	/*
	 *���������Ƿ�֧��placeholder����;֧�ַ���true�����򷵻�false
	 * */
	var isSupportPlaceHolder = function() {
		return 'placeholder' in document.createElement('input');
	};

	var D = S.DOM, E = S.Event;

	/*
	 *����ʽ���������placeholder���ԣ�����ű�����ҳ�������ϵ��øú������ɣ�
	 * ռλ���ı���������ɫ�� Ĭ��Ϊ�����Ĭ����ɫ,
	 * color:����ռλ���ı���ɫ
	 * */
	var Placeholder = function(el, color) {

		/*ԭ��֧��placeholder������������ռλ���ı���ɫ����ֱ�ӷ���*/
		if (isSupportPlaceHolder() && !color) {
			return;
		}

		if (!( el = D.get(el))) {
			return;
		}

		/*�ڲ�focus�¼���������*/
		var _focusHandler = function(evt) {
			hldTxt = D.attr(this, 'placeholder');
			//����ı���������ռλ���ı�һ�£�������ı���
			if (hldTxt == this.value) {
				var $oldColor = D.data(this, 'oldColor');
				this.value = '';
				//����ռλ��������ɫ
				$oldColor && (D.css(this, 'color', $oldColor));
			}
		};

		/*�ڲ�blur�¼���������*/
		var _blurHandler = function(evt) {
			var hldTxt = D.attr(this, 'placeholder');
			//����ı���������ռλ���ı�һ�£�������ռλ��������ɫ
			if (hldTxt == this.value || this.value == '') {
				//��ֵΪ�գ���ԭռλ���ı�
				this.value = hldTxt;
				//����ԭ�е�����ɫ
				D.data(this, 'oldColor', D.css(this, 'color'));
				//����ռλ��������ɫ
				color && D.css(this, 'color', color);
			}
		};

		E.on(el, 'focus', _focusHandler);
		E.on(el, 'blur', _blurHandler);

		el.form && E.on(el.form, 'submit', function(ev) {
			_focusHandler.call(el);
			setTimeout(function() {
				_blurHandler.call(el);
			}, 10);
		});

		_blurHandler.call(el);
	};

	return Placeholder;
});

