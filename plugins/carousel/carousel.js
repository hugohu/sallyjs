/*
 * carousel 1.0
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-03-13
 * 代码完全重构
 * 焦点图片切换
 * 参数说明
 * auto 配置是否滚动 默认值 true 可用值false
 * outTime 配置轮播切换时间 默认 4000ms 可以更改为任意数字
 * ebox 配置进行轮播的主体 默认为第一个子元素.可以自己任意更改为
 * class
 *
 * 配置方法 设置元素的 data-set='{"key":"value"}' json格式即可.
 *
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
	// 这里放模块代码
	$.fn.carousel = function(options) {
		return this.each(function() {
			//code
			var $this = $(this),
				_WIDTH = $this.width(),
				edata = $this.attr("data-set"),
				oSetOptions = {};
			edata && (oSetOptions = $.parseJSON(edata));
			// set options
			var auto = oSetOptions.auto == "false" ? false : true,
				outTime = parseInt(oSetOptions.outTime) || 4000,
				ebox = oSetOptions.ebox ? $this.find(oSetOptions.ebox) : $this.children().first(),
				edot = oSetOptions.edot,
				emod = ebox.children(),
				emod_len = emod.size(),
				eWidth = emod.width(),
				emod_width = eWidth * emod_len,
				plen = Math.floor(_WIDTH / eWidth),
				_moveWidth = plen * eWidth,
				nlen = Math.ceil(emod_len / plen);

			if (nlen <= 1) {
				return;
			}
			// set html		
			if (edot) {
				html = html = '<i class="dir prev hide" data-dir="-"></i><i class="dir next" data-dir="+"></i>';
			} else {
				var html = '<i class="dir prev hide" data-dir="-"></i><i class="dir next" data-dir="+"></i><span class="dot"><i class="active" data-index="0"></i>';
				for (var i = 1; i < nlen; i++) {
					html += '<i data-index="' + i + '"></i>';
				}
				html += "</span>"
			}

			$this.append(html);
			var eprev = $this.find(".prev"),
				enext = $this.find(".next"),
				edot = $this.find(edot || ".dot").children();

			var carousel = {
				index: 0,
				play: function(arr, ind) {
					var index = this.setIndex(arr, ind);

					//计算移动长度
					if (index == nlen - 1) {
						var dis = _WIDTH - emod_width;
					} else {
						var dis = -_moveWidth * index;
					}
					//高级浏览器开启硬件加速
					var isIE9_ = document.all && !window.atob;
					if (isIE9_) {
						ebox.animate({
							"margin-left": dis
						}, 350)
					} else {
						var eli = ebox.children();
						var delayLong = 35 * eli.length;
						var translate = 'translate(' + dis + 'px,0px)  translateZ(0px)';
						eli.each(function(index, elem) {
							if (arr == "-") {
								delay = delayLong - 35 * index;
							} else {
								delay = (35 * index) > delayLong ? delayLong : (35 * index);
							}
							delay+="ms";
							var _this = $(this);
							_this.css({
									'-webkit-transform': translate,
									'-moz-transform': translate,
									'-ms-transform': translate,
									'-o-transform': translate,
									'transform': translate,
									'-webkit-transition-delay': delay,
									'-moz-transition-delay': delay,
									'-ms-transition-delay': delay,
									'-o-transition-delay': delay,
									'transition-delay': delay,
								})
						})
					};
					this.setActive(index);
					!auto && this.hideButton(index);
				},
				setIndex: function(arr, ind) {
					var index = this.index;
					switch (arr) {
						case "+":
							if (index == nlen - 1) {
								return this.index = 0;
							} else {
								return this.index += 1;
							}
							break;
						case "-":
							if (index == 0) {
								return this.index = nlen - 1;
							} else {
								return this.index -= 1;
							}
							break;
						case "click":
							return this.index = ind;
					}
				},
				setActive: function(index) {
					edot.eq(index).addClass("active").siblings().removeClass("active");
				},
				autoPalay: function() {
					this.loop = setInterval(function() {
						carousel.play("+");
					}, outTime)
				},
				stop: function() {
					clearInterval(carousel.loop);
				},
				hideButton: function(index) {
					if (index == nlen - 1) {
						enext.addClass("hide");
						eprev.removeClass("hide");
					} else if (index == 0) {
						eprev.addClass("hide");
						enext.removeClass("hide");
					} else {
						enext.removeClass("hide");
						eprev.removeClass("hide");
					}

				},
				init: function() {
					if (auto) {
						this.autoPalay();
						//hover
						$this.hover(function() {
							carousel.stop();
						}, function() {
							carousel.loop = setInterval(function() {
								carousel.play("+");
							}, outTime);
						});
					}
					// next
					enext.on("click", function() {
						carousel.play("+");
					});
					//next
					eprev.on("click", function() {
						carousel.play("-");
					});
					//edot
					edot.on("click", function() {
						var $this = $(this);
						var index = edot.index(this);
						carousel.play("click", index);
					})
				}
			}
			carousel.init();
			// end
		});
	};
	//DATA API
	$('[data-event="carousel"]').carousel();
}));