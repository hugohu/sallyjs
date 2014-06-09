(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {

	var Carousel = function($this, params) {
		var _this = this;

		_this.$this = $this;
		_this.index = 0;
		_this.dataSet = _this.$this.attr("data-set");
		_this.set = _this.dataSet ? $.parseJSON(_this.dataSet) : {};
		//设置默认参数
		var defaults = {
			width: _this.$this.width(),
			auto: true,
			outTime: 4000,
			ebox: _this.$this.children().first(),
			edot: ".dot",
			eprev: ".prev",
			enext: ".next",
			hasDot: false,
			hasArr: false,
			easyPlay: false
		};
		_this.params = $.extend(defaults, params || _this.set);

		//set 程序运行需要的参数
		_this.slideBox = _this.$this.find(_this.params["ebox"]).children();
		_this.slideBoxLen = _this.slideBox.size();
		_this.slideBoxWidth = _this.slideBox.width();
		_this.slideBoxAllWidth = _this.slideBoxWidth * _this.slideBoxLen;
		_this.pageLen = Math.floor(_this.params["width"] / _this.slideBoxWidth);
		_this.moveWidth = _this.pageLen * _this.slideBoxWidth;
		_this.pageCount = Math.ceil(_this.slideBoxLen / _this.pageLen);


		// 设置箭头
		_this.setCarousel = function(Temp) {
			var html = "";
			if (!_this.params["hasDot"]) {
				html += '<span class="dot">\n' +
					'<i class="active" data-index="0"></i>\n'
				for (var i = 1; i < _this.pageCount; i++) {
					html += '<i data-index="' + i + '"></i>\n';
				}
				html += "</span>";
			}
			if (!_this.params["hasArr"]) {
				html += '<i class="dir prev hide" data-dir="-"></i>\n' +
					'<i class="dir next" data-dir="+"></i>'
			}
			$(html).appendTo(_this.$this);
			_this.edot = _this.$this.find(_this.params["edot"]).children();
			_this.eprev = _this.$this.find(_this.params["eprev"]);
			_this.enext = _this.$this.find(_this.params["enext"]);
		}
		//
		_this.play = function(arr, ind) {
			var index = _this.setIndex(arr, ind);
			var isIE9_ = document.all && !window.atob;
			//计算移动长度
			if (index == _this.pageCount - 1) {
				var dis = _this.params["width"] - _this.slideBoxAllWidth;
			} else {
				var dis = -_this.moveWidth * index;
			}
			if (_this.isNotSupportTranslate()) {
				_this.params["ebox"].animate({
					"margin-left": dis
				}, 350)
			} else {
				if (_this.params["easyPlay"]) {
					var el = _this.params["ebox"][0];
					_this.setTranslate(el, dis);
				} else {
					var delayLong = 35 * _this.slideBoxLen;
					_this.slideBox.each(function(index, elem) {
						if (arr == "-") {
							delay = delayLong - 35 * index;
						} else {
							delay = (35 * index) > delayLong ? delayLong : (35 * index);
						}
						var that = $(this)[0];
						_this.setTranslate(that, dis);
						_this.setTransitionDelay(that, delay);

					})

				}

			}
			//others
			_this.setActive(index);
			!_this.params["auto"] && _this.hideButton(index);
		}

		_this.setIndex = function(arr, ind) {
			var index = _this.index;
			switch (arr) {
				case "+":
					if (index == _this.pageCount - 1) {
						return _this.index = 0;
					} else {
						return _this.index += 1;
					}
					break;
				case "-":
					if (index == 0) {
						return _this.index = _this.pageCount - 1;
					} else {
						return _this.index -= 1;
					}
					break;
				case "click":
					return _this.index = ind;
			}
		}

		_this.setActive = function(index) {
			_this.edot.eq(index).addClass("active").siblings().removeClass("active");
		}
		_this.autoPlay = function() {
			_this.stopPlay();
			_this.loop = setInterval(function() {
				_this.play("+");
			}, _this.params["outTime"])
		}
		_this.stopPlay = function() {
			clearInterval(_this.loop);
		}
		_this.hideButton = function(index) {
			if (index == _this.pageCount - 1) {
				_this.enext.addClass("hide");
				_this.eprev.removeClass("hide");
			} else if (index == 0) {
				_this.eprev.addClass("hide");
				_this.enext.removeClass("hide");
			} else {
				_this.enext.removeClass("hide");
				_this.eprev.removeClass("hide");
			}
		}
		_this.init = function() {
			if (_this.pageCount <= 1) {
				return;
			}
			_this.setCarousel();
			//添加事件
			if (_this.params["auto"]) {
				_this.autoPlay();
				_this.$this.on({
					"mouseover": function() {
						_this.stopPlay();
					},
					"mouseout": function() {
						_this.autoPlay();
					}
				});
			}

			// next
			_this.enext.on("click", function() {
				_this.play("+");
			});
			//next
			_this.eprev.on("click", function() {
				_this.play("-");
			});
			//edot
			_this.edot.on("click", function() {
				var index = edot.index(this);
				carousel.play("click", index);
			})
		}

		_this.init();
	}
	Carousel.prototype = {
		/*==================================================
        Helpers
   		====================================================*/
		isNotSupportTranslate: function() {
			var isIE9_ = document.all && !window.atob
			return !!isIE9_;
		},
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
		setTranslate: function(el, dis) {
			'use strict';
			var es = el.style;
			var transformString = 'translate(' + dis + 'px,0px)  translateZ(0px)'
			es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
		},
		setTransitionDuration: function(el, duration) {
			'use strict';
			var es = el.style;
			es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + 'ms';
		},
		setTransitionDelay: function(el, Delay) {
			'use strict';
			var es = el.style;
			es.webkitTransitionDelay = es.MsTransitionDelay = es.msTransitionDelay = es.MozTransitionDelay = es.OTransitionDelay = es.transitionDelay = Delay + 'ms';
		}
	}
	// code
	$.fn.carousel = function(params) {
		var s = new Carousel($(this), params);
		$(this).data('swiper', s);
		return s;
	};
	//DATA API
	$('[data-event="carousel"]').carousel();
	//return $.widget;
}));