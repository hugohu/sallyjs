/*
 * carousel 1.2
 * Copyright (c) 2014 Huugle  http://huugle.org/
 * Date: 2014-06-09
 *
 * 焦点图片切换 代码完全重构
 *
 * 配置方法 设置元素的 data-set='{"key":"value"}' json格式即可.
 * {number}跟{boolean}类型不需要加 " ";
 *
 */

(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {

	var Carousel = function(that, params) {
		var _this = this;
		_this.that = that;
		_this.index = 0;
		_this.dataSet = _this.that.attr("data-set");
		_this.set = _this.dataSet ? $.parseJSON(_this.dataSet) : {};
		/**
		 * [defaults 默认参数列表]
		 * @type {Object}
		 * 参数说明---
		 * [width 轮播的宽度]
		 * @type {number}
		 *
		 * [auto 是否自动轮播]
		 * @type {boolean}
		 *
		 * [outTime 轮播等待的时间]
		 * @type {number}
		 *
		 * [ebox 进行轮播的父元素]
		 * @type {selector string}
		 *
		 * [edot 下标元素]
		 * @type {selector string}
		 *
		 * [eprev enext  上一页 下一页]
		 * @type {selector string}
		 *
		 * [hasDot 是否有生成下标]
		 * @type {boolean}
		 *
		 * [hasArr 是否生成左右箭头]
		 * @type {boolean}
		 *
		 * [easyPlay 是否启用简单轮播模式]
		 * @type {boolean}
		 * @描述 这个是确定轮播的宽度设置在父元素还是子元素上,
		 * 高级浏览器有效.
		 *
		 */
		var defaults = {
			width: _this.that.width(),
			auto: true,
			outTime: 4000,
			ebox: _this.that.children().first(),
			edot: ".dot",
			eprev: ".prev",
			enext: ".next",
			hasDot: false,
			hasArr: false,
			easyPlay: true,
			move:false,
			hideButton: false,
			hideButtonClass: "hide"
		};

		/**
		 * [params 载入参数]
		 * @type {[object]}
		 * @描述 三部分,默认参数,用户data-set 里的参数或者直接调用的参数.
		 */
		_this.params = $.extend(defaults, params || _this.set);


		/**
		 * 程序运行需要的参数
		 *
		 */
		_this.slideBox = _this.that.find(_this.params["ebox"]).children();
		_this.slideBoxLen = _this.slideBox.size();
		_this.slideBoxWidth = _this.slideBox.width();
		_this.slideBoxAllWidth = _this.slideBoxWidth * _this.slideBoxLen;
		_this.pageLen = Math.floor(_this.params["width"] / _this.slideBoxWidth);
		_this.moveWidth = _this.pageLen * _this.slideBoxWidth;
		_this.pageCount = Math.ceil(_this.slideBoxLen / _this.pageLen);
		_this.dis = 0;
		/**
		 * [setCarousel 设置初始轮播点跟左右箭头]
		 */
		_this.setCarousel = function() {
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
				html += '<i class="dir prev" data-dir="-"></i>\n' +
					'<i class="dir next" data-dir="+"></i>'
			}
			$(html).appendTo(_this.that);
			_this.edot = _this.that.find(_this.params["edot"]).children();
			_this.eprev = _this.that.find(_this.params["eprev"]);
			_this.enext = _this.that.find(_this.params["enext"]);
		}
		/**
		 * [play 进行轮播主体内容]
		 * @param  {[string]} arr [方向标志"+" or "-"]
		 * @param  {[number]} ind [第几张]
		 */
		_this.play = function(arr, ind) {
			var index = _this.setIndex(arr, ind);
			var isIE9_ = document.all && !window.atob;
			//计算移动长度
			if (index == _this.pageCount - 1) {
				_this.dis = _this.params["width"] - _this.slideBoxAllWidth;
			} else {
				_this.dis = -_this.moveWidth * index;
			}
			if (_this.isNotSupportTranslate()) {
				_this.params["ebox"].animate({
					"margin-left": _this.dis
				}, 350)
			} else {
				if (_this.params["easyPlay"]) {
					var el = _this.params["ebox"][0];
					_this.setTranslate(el, _this.dis);
				} else {
					var delayLong = 35 * _this.slideBoxLen;
					_this.slideBox.each(function(index, elem) {
						if (arr == "-") {
							delay = delayLong - 35 * index;
						} else {
							delay = (35 * index) > delayLong ? delayLong : (35 * index);
						}
						var that = $(this)[0];
						_this.setTranslate(that, _this.dis);
						_this.setTransitionDelay(that, delay);

					})

				}

			}
			//others
			_this.setActive(index);
			_this.params["hideButton"] && _this.hideButton(index);
		}
		/**
		 * [setIndex 设置索引]
		 * @param {[string]} arr [方向 "+" or "-"]
		 * @param {[number]} ind [索引]
		 */
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
		/**
		 * [setActive 设置下标选中]
		 * @param {[number]} index [索引]
		 */
		_this.setActive = function(index) {
			_this.edot.eq(index).addClass("active").siblings().removeClass("active");
		}
		/**
		 * [autoPlay 设置自动轮播]
		 */
		_this.autoPlay = function() {
			_this.stopPlay();
			_this.loop = setInterval(function() {
				_this.play("+");
			}, _this.params["outTime"])
		}
		/**
		 * [autoPlay 停止自动轮播]
		 */
		_this.stopPlay = function() {
			clearInterval(_this.loop);
		}
		_this.hideButton = function(index) {
			var hideButtonClass = _this.params["hideButtonClass"]
			if (index == _this.pageCount - 1) {
				_this.enext.addClass(hideButtonClass);
				_this.eprev.removeClass(hideButtonClass);
			} else if (index == 0) {
				_this.eprev.addClass(hideButtonClass);
				_this.enext.removeClass(hideButtonClass);
			} else {
				_this.enext.removeClass(hideButtonClass);
				_this.eprev.removeClass(hideButtonClass);
			}
		}
		_this.mouse = function() {
			isTouch=!!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
		var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
		_this.touches={diff:0};
    _this.touchEvents = {
        touchStart : isTouch  ? 'touchstart' : desktopEvents[0],
        touchMove : isTouch ? 'touchmove' : desktopEvents[1],
        touchEnd : isTouch ? 'touchend' : desktopEvents[2]
    };


			_this.that.on(_this.touchEvents.touchStart,function(e) {
				_this.touches.ismove = true;
				_this.touches.startX  = isTouch ? event.targetTouches[0].pageX : (e.pageX || e.clientX);
				e.preventDefault();
			})

			$(document).on(_this.touchEvents.touchMove, function(e) {
				if (_this.touches.ismove) {
					_this.touches.current = isTouch ? event.targetTouches[0].pageX : (e.pageX || e.clientX);
					_this.touches.diff = (_this.touches.current - _this.touches.startX) * 1;
					var that = _this.params["ebox"][0];
					_this.setTransitionDuration(that, 0);
					_this.setTranslate(that, _this.dis * 1 + _this.touches.diff);
					e.preventDefault()
				}
			});

			$(document).on(_this.touchEvents.touchEnd,function(e) {
				_this.touches.ismove = false;
				//$(document).off(_this.touchEvents.touchMove);
				var that = _this.params["ebox"][0];
				_this.setTransitionDuration(that, 350);
				if(Math.abs(_this.touches.diff)<75){
					_this.setTranslate(that, _this.dis);
					return ;
				}
				if (_this.touches.diff<0) {
					_this.play("+");
				} else {
					_this.play("-");
				}
				e.preventDefault();
			})

		}
		_this.init = function() {
			if (_this.pageCount <= 1) {
				return;
			}
			_this.setCarousel();
			_this.params["hideButton"] && _this.hideButton(0);
			//添加事件
			if (_this.params["auto"]) {
				_this.autoPlay();
				_this.that.on({
					"mouseover": function() {
						_this.stopPlay();
					},
					"mouseout": function() {
						_this.autoPlay();
					}
				});
			}
			if(_this.params["move"]){
				_this.mouse();
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
				var index = _this.edot.index(this);
				_this.play("click", index);
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
		setTranslate: function(el, dis) {
			'use strict';
			var es = el.style;
			var transformString = 'translate(' + dis + 'px,0px)  translateZ(0px)'
			es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
		},
		setTransitionDelay: function(el, Delay) {
			'use strict';
			var es = el.style;
			es.webkitTransitionDelay = es.MsTransitionDelay = es.msTransitionDelay = es.MozTransitionDelay = es.OTransitionDelay = es.transitionDelay = Delay + 'ms';
		},
		setTransitionDuration: function(el, Delay) {
			'use strict';
			var es = el.style;
			es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = Delay + 'ms';
		}
	}
	// code
	$.fn.carousel = function(params) {
		 this.each(function() {
			var s = new Carousel($(this), params);
					$(this).data('carousel', s);
					return s;
		 })
		};
		$(function(){
				$('[data-event="carousel"]').carousel();
		})
	//return $.widget;
}));

window.console&&window.console.info('  ┏┓　　　┏┓\n┏┛┻━━━┛┻┓\n┃　　　　　　　┃ 　\n┃　　　━　　　┃\n┃　┳┛　┗┳　┃\n┃　　　　　　　┃\n┃　　　┻　　　┃\n┃　　　　　　　┃\n┗━┓　　　┏━┛\n    ┃　　　┃  Beast god bless　　　　　　　　\n    ┃　　　┃  The code no bug！\n    ┃　　　┗━━━┓\n    ┃　　　　　　　┣┓\n    ┃　　　　　　　┏┛\n    ┗┓┓┏━┳┓┏┛\n      ┃┫┫　┃┫┫\n      ┗┻┛  ┗┻┛')

 