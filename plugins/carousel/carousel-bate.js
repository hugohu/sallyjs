(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {

	var Swiper = function($this, params) {
		var _this = this;


		_this.that = $this;
		_this.WIDTH = _this.that.width();

		//设置默认参数
		var defaults = {};
		_this.params = $.extend(defaults, params);

		Swiper.prototype = {
			/*==================================================
        Helpers
    ====================================================*/
			getformat: function(template, json) {
				return template.replace(/{{(.*?)}}/g, function(all, key) {
					return json && (key in json) ? json[key] : "";
				});
			},
			setTransform: function(el, transform) {
				'use strict';
				var es = el.style;
				es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform;
			},
			setTranslate: function(el, translate) {
				'use strict';
				var es = el.style;
				var pos = {
					x: translate.x || 0,
					y: translate.y || 0,
					z: translate.z || 0
				};
				var transformString = this.support.transforms3d ? 'translate3d(' + (pos.x) + 'px,' + (pos.y) + 'px,' + (pos.z) + 'px)' : 'translate(' + (pos.x) + 'px,' + (pos.y) + 'px)';
				es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
				if (!this.support.transforms) {
					es.left = pos.x + 'px';
					es.top = pos.y + 'px';
				}
			},
			setTransition: function(el, duration) {
				'use strict';
				var es = el.style;
				es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + 'ms';
			}
		}

	}

	// code
	$.fn.swiper = function(params) {
		var s = new Swiper($(this), params);
		$(this).data('swiper', s);
		return s;
	};

	//return $.widget;
}));