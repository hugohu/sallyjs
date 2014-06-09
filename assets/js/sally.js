/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-01-21
 * layer
 */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // code
jQuery.fn.ajaxsubmit = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  // options fn 
  this.each(function() {
    //code...
    var set_data = options.data;
    var $this = $(this),
      adata = set_data ? ($this.serialize() + set_data) : $this.serialize();
    action = this.action,
    method = this.method;
    $.ajax({
      type: method,
      url: action,
      data: adata,
      success: options.success,
      statusCode: options.code
    });
  });
};

  //DATA API
//$("[data-event='ajaxsubmit']").ajaxsubmit();
   // return $.widget;

}));

;/*
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
							//内容不多 所以直接处理
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
}));;/*
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

	var Carousel = function($this, params) {
		var _this = this;
		_this.$this = $this;
		_this.index = 0;
		_this.dataSet = _this.$this.attr("data-set");
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
		_this.slideBox = _this.$this.find(_this.params["ebox"]).children();
		_this.slideBoxLen = _this.slideBox.size();
		_this.slideBoxWidth = _this.slideBox.width();
		_this.slideBoxAllWidth = _this.slideBoxWidth * _this.slideBoxLen;
		_this.pageLen = Math.floor(_this.params["width"] / _this.slideBoxWidth);
		_this.moveWidth = _this.pageLen * _this.slideBoxWidth;
		_this.pageCount = Math.ceil(_this.slideBoxLen / _this.pageLen);


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
				html += '<i class="dir prev hide" data-dir="-"></i>\n' +
					'<i class="dir next" data-dir="+"></i>'
			}
			$(html).appendTo(_this.$this);
			_this.edot = _this.$this.find(_this.params["edot"]).children();
			_this.eprev = _this.$this.find(_this.params["eprev"]);
			_this.enext = _this.$this.find(_this.params["enext"]);
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
}));;/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-01-21
 * layer
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
  // code
  var layer = {
    open: function() {
      $("body").on('keyup', this.onDocumentKeyup)
        .on("click", this.onDocumentClick)
        .addClass("f-layer-show");
    },
    closed: function() {
      $("body").off('keyup', this.onDocumentKeyup)
        .off("click", this.onDocumentClick)
        .removeClass("f-layer-show");
    },
    onDocumentKeyup: function(e) {
      if (e.keyCode === 27) {
        layer.closed();
      }
    },
    onDocumentClick: function(e) {
      if ($(e.target).is('[data-event="close"],.m-masklayer')) {
        e.preventDefault();
        layer.closed();
      }
    },
    setoff: function(ele) {
      var off = ele.offset();
      var scrollTop = $(window).scrollTop();
      var _Top = off.top - scrollTop;
    this.etarget=$("#"+ele.attr("data-target"))
     this.etarget.css({
        "left": off.left,
        "top": _Top
      })
    }
  }


  $.fn.layer = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    
    //code
     if ($(".m-masklayer").length == 0) {
        $("body").append('<div class="m-masklayer"></div>');
      } 
      layer.open();
  };

   
  //DATA API
   $(document).on("click", '[data-event="layer"]', function(e) {
    $(this).layer();
      e.preventDefault();
    }).on("mouseover", '[data-event="layer"]', function() {
      layer.setoff($(this));
    })
  // return $.widget;

}));;/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-01-21
 * layer
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
  // code
  $.fn.menuAim = function(opts) {
    // Initialize menu-aim for all elements in jQuery collection
    this.each(function() {
      init.call(this, opts);
    });

    return this;
  };

  function init(opts) {
    var $menu = $(this),
      activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = $.extend({
        rowSelector: "> li",
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75, // bigger = more forgivey when entering submenu
        enter: $.noop,
        exit: $.noop,
        activate: $.noop,
        deactivate: $.noop,
        exitMenu: $.noop
      }, opts);

    var MOUSE_LOCS_TRACKED = 3, // number of past mouse locations to track
      DELAY = 300; // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function(e) {
      mouseLocs.push({
        x: e.pageX,
        y: e.pageY
      });

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
        if (timeoutId) {
          // Cancel any previous activation delays
          clearTimeout(timeoutId);
        }

        options.enter(this);
        possiblyActivate(this);
      },
      mouseleaveRow = function() {
        options.exit(this);
      };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      var offset = $menu.offset(),
        upperLeft = {
          x: offset.left,
          y: offset.top - options.tolerance
        },
        upperRight = {
          x: offset.left + $menu.outerWidth(),
          y: upperLeft.y
        },
        lowerLeft = {
          x: offset.left,
          y: offset.top + $menu.outerHeight() + options.tolerance
        },
        lowerRight = {
          x: offset.left + $menu.outerWidth(),
          y: lowerLeft.y
        },
        loc = mouseLocs[mouseLocs.length - 1],
        prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
        prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc &&
        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope &&
        increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    $menu
      .mouseleave(mouseleaveMenu)
      .find(options.rowSelector)
      .mouseenter(mouseenterRow)
      .mouseleave(mouseleaveRow)
      .click(clickRow)
      .mousemove(mousemoveDocument);
    // huugle Modify $(document).mousemove -> $menu 2014-5-9
  };
  //DATA API
  var $menu = $('[data-event="menu"]');
  $menu.menuAim({
    activate: function(row) {
      $(row).addClass("active");
    },
    deactivate: function(row) {
      $(row).removeClass("active");
    },
    exitMenu: function(row) {
      $(row).find("li").removeClass("active");
    }
  });
  //bug fix
  var li = $menu.children();
  li.on("mouseenter", function() {
    var active = li.filter(".active");
    if (active.length == 0) {
      $(this).addClass("active");
    }
  })
  // return $.widget;

}));;/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-01-21
 * layer
 */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // code
/*
    // Method: jQuery.throttle
    // 
    // Throttle execution of a function. Especially useful for rate limiting
    // execution of handlers on events like resize and scroll. If you want to
    // rate-limit execution of a function to a single time, see the
    // <jQuery.debounce> method.
    // 
    // In this visualization, | is a throttled-function call and X is the actual
    // callback execution:
    // 
    // > Throttled with `no_trailing` specified as false or unspecified:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // > X    X    X    X    X    X        X    X    X    X    X    X
    // > 
    // > Throttled with `no_trailing` specified as true:
    // > ||||||||||||||||||||||||| (pause) |||||||||||||||||||||||||
    // > X    X    X    X    X             X    X    X    X    X
    // 
    // Usage:
    // 
    // > var throttled = jQuery.throttle( delay, [ no_trailing, ] callback );
    // > 
    // > jQuery('selector').bind( 'someevent', throttled );
    // > jQuery('selector').unbind( 'someevent', throttled );
    // 
    // This also works in jQuery 1.4+:
    // 
    // > jQuery('selector').bind( 'someevent', jQuery.throttle( delay, [ no_trailing, ] callback ) );
    // > jQuery('selector').unbind( 'someevent', callback );
    // 
    // Arguments:
    // 
    //  delay - (Number) A zero-or-greater delay in milliseconds. For event
    //    callbacks, values around 100 or 250 (or even higher) are most useful.
    //  no_trailing - (Boolean) Optional, defaults to false. If no_trailing is
    //    true, callback will only execute every `delay` milliseconds while the
    //    throttled-function is being called. If no_trailing is false or
    //    unspecified, callback will be executed one final time after the last
    //    throttled-function call. (After the throttled-function has not been
    //    called for `delay` milliseconds, the internal counter is reset)
    //  callback - (Function) A function to be executed after delay milliseconds.
    //    The `this` context and all arguments are passed through, as-is, to
    //    `callback` when the throttled-function is executed.
    // 
    // Returns:
    // 
    //  (Function) A new, throttled, function.
*/
$.throttle = function(delay, no_trailing, callback, debounce_mode) {
  // After wrapper has stopped being called, this timeout ensures that
  // `callback` is executed at the proper times in `throttle` and `end`
  // debounce modes.
  var timeout_id,

    // Keep track of the last time `callback` was executed.
    last_exec = 0;

  // `no_trailing` defaults to falsy.
  if (typeof no_trailing !== 'boolean') {
    debounce_mode = callback;
    callback = no_trailing;
    no_trailing = undefined;
  }

  // The `wrapper` function encapsulates all of the throttling / debouncing
  // functionality and when executed will limit the rate at which `callback`
  // is executed.
  function wrapper() {
    var that = this,
      elapsed = +new Date() - last_exec,
      args = arguments;

    // Execute `callback` and update the `last_exec` timestamp.
    function exec() {
      last_exec = +new Date();
      callback.apply(that, args);
    };

    // If `debounce_mode` is true (at_begin) this is used to clear the flag
    // to allow future `callback` executions.
    function clear() {
      timeout_id = undefined;
    };

    if (debounce_mode && !timeout_id) {
      // Since `wrapper` is being called for the first time and
      // `debounce_mode` is true (at_begin), execute `callback`.
      exec();
    }

    // Clear any existing timeout.
    timeout_id && clearTimeout(timeout_id);

    if (debounce_mode === undefined && elapsed > delay) {
      // In throttle mode, if `delay` time has been exceeded, execute
      // `callback`.
      exec();

    } else if (no_trailing !== true) {
      // In trailing throttle mode, since `delay` time has not been
      // exceeded, schedule `callback` to execute `delay` ms after most
      // recent execution.
      // 
      // If `debounce_mode` is true (at_begin), schedule `clear` to execute
      // after `delay` ms.
      // 
      // If `debounce_mode` is false (at end), schedule `callback` to
      // execute after `delay` ms.
      timeout_id = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay);
    }
  };

  // Set the guid of `wrapper` function to the same of original callback, so
  // it can be removed in jQuery 1.4+ .unbind or .die by using the original
  // callback as a reference.
  if ($.guid) {
    wrapper.guid = callback.guid = callback.guid || $.guid++;
  }

  // Return the wrapper function.
  return wrapper;
};
jQuery.fn.roll = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  this.each(function() {
    var $this = $(this),
      _target = $this.attr("data-target") || "active",
      _event = options.event || $this.attr("data-roll");
    var build = {
      fixed: function() {
        var HEIGTH_THIS = $this.height(),
          WIDTH_THIS = $this.width(),
          delay = 37;
        this.top = $this.offset().top;
        //SETHTML
        $this.wrap('<div style="width:' + WIDTH_THIS + 'px; height:' + HEIGTH_THIS + 'px;position:relative">' + '</div>');
        this.start(delay, this.setFiexd);
      },
      direction: function() {
        var st = $(window).scrollTop();
        var dis = "";
        $this.dirs = $this.dirs ? $this.dirs : st;
        if (st < $this.dirs) {
          dis = "up"
        } else {
          dis = "down"
        }
        $this.dirs = st;
        return dis;
      },
      follow: function() {
        var ele = $("a", $this);
        var obj = {};
        $this.data("index", 0);
        obj.length = ele.length - 1;
        ele.each(function(index, elem) {
          var _Id = $(this).attr("href")
          var _TOP = parseInt($(_Id).offset().top) - 90;
          obj[index] = {
            index: index,
            id: _Id,
            top: _TOP
          }
        });

        function setActived(index) {
          ele.removeClass("active");
          ele.eq(index).addClass("active");
        }

        function setfollow() {
          var index = $this.data("index");
          var inext = (index + 1 > obj.length) ? obj.length : index + 1;
          var iprev = (index - 1 < 0) ? 0 : index - 1;
          var _aNext = obj[inext];
          var _aPrev = obj[iprev];
          var _aTop = obj[index].top;

          var st = $(window).scrollTop();
          if (st > _aTop && st < _aNext.top) {
            setActived(index);
          } else if (st < _aTop && st > _aPrev.top) {
            $this.data("index", _aPrev.index)
            setActived(_aPrev.index)
          } else if (st > _aNext.top) {
            $this.data("index", _aNext.index)
            setActived(_aNext.index)
          }


        }
        var delay = 37;
        this.start(delay, setfollow);
      },
      gotop: function() {
        $this.on("click", function(e) {
          build.setTop()
          e.preventDefault();
        });
        this.top = 600;
        var delay = 37;
        this.start(delay, this.setFiexd);
      },
      setTop: function() {
        $("html, body").animate({
          scrollTop: 0
        }, 120);
      },
      setFiexd: function() {
        var st = $(window).scrollTop();
        if (st > build.top) {
          $this.addClass(_target);
        } else {
          $this.removeClass(_target);
        }
      },
      start: function(delay, f) {
        f();
        $(window).on("scroll", $.throttle(delay, f));
      }
    };

    build[_event] && build[_event]();
    //event
  });
};

  //DATA API
$("[data-roll]").roll();
   // return $.widget;

}));

;/* =========================================================
 * star 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2014 Huugle
 *
 * Date: 2013-01-21
 * 选择星星
 * ========================================================= */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // code
 $.fn.star = function (options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    // options fn 
    this.each(function () {
        //code...
        var $this = $(this);
        var child = $this.children();
        var input = $this.find("input");
        $this.on({
            "mouseover.star": function () {
                var eActive = child.filter(".active"),
                    index = child.index(eActive);
                $this.data("index", index);
                eActive.removeClass("active");
            },
            "mouseout.star": function () {
                var index = $this.data("index"),
                eActive=child.eq(index),
                value=eActive.attr("data-value");
                input.val(value);
                eActive.addClass("active");
            },
            "click.star": function (e) {
                var eTarget = e.target;
                var index = child.index(eTarget);
                $this.data("index", index);
            }
        });

    });
}; 
  //data api
   $("[data-event='star']").star();  
    
    //return $.widget;
}));
;/* =========================================================
 * huTab 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2013 Huugle
 *
 * Date: 2013-01-21
 * 滑动门可以实现div切换
 * ========================================================= */


(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // code
      $.fn.tab = function(options) {
        this.each(function() {
            //code...
            var $this = $(this),
                ehead = $(".tab-hd", $this).children(),
                ebody = $(".tab-bd", $this).children(),
                $event = ($this.attr("data-type")) || "mouseover";

            function Setactive() {
                var index = ehead.index(this);
                $(this).addClass("active").siblings().removeClass("active");
                ebody.eq(index).addClass("active").siblings().removeClass("active");
            }
            //event
            ehead.on($event, Setactive);
        });
    };
  /*  DARA API  */  
 $('[data-event="tab"]').tab();    
    //return $.widget;
}));
;/*
 * toggle 0.2
 * Copyright (c) 2014 Huugle  http://sallyjs.huugle.org/
 * Date: 2014-06-04
 *
 *  思路说明:可以用addMethod的方法添加补充事件,比如
 *  $.stoggle.addMethod({name},{f})
 *  其中name为模块名称,f为匿名函数.
 *  如果不是click事件,请在结尾处添加 $.stoggle.load({name});
 *  click事件直接写具体事件$.stoggle.addMethod({name},function($this,tar){ //code })
 *  $this 为触发事件的元素
 *  tar为触发元素自定义属性 data-target 里的字符串.
 *  通常用于自定义切换样式等.
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
  $.stoggle = function(elements, options) {
    $(elements).stoggle(options);
  };

  $.extend($.stoggle, {
    addMethod: function(name, method) {
      $.stoggle.methods[name] = method;
    },
    methods: {
      alert: function($this) {
        $this.parent().hide(350);
      },
      actived: function($this, tar) {
        $this.addClass(tar).siblings().removeClass(tar);
      },
      anchor: function($this) {
        var href = $this.attr("href");
        if (!href) {
          return false;
        }
        var _id = $(href);
        var TOP = parseInt(_id.offset().top) - 70;
        $("html, body").animate({
          scrollTop: TOP
        }, 500);
      },
      tclass: function($this, tar) {
        $this.toggleClass(tar);
      },
      alert: function($this) {
        $this.parent().hide();
      }
    },
    sMethods: [{
      type: "hover",
      motion: function($this, tar) {
        $this.on("mouseover", function() {
          clearTimeout($this.timeout);
          $this.timeout = setTimeout(function() {
            $this.addClass(tar);
          }, 200);
        }).on("mouseout", function() {
          clearTimeout($this.timeout);
          $this.timeout = setTimeout(function() {
            $this.removeClass(tar);
          }, 0);
        });
      }
    }],
    load: function(s) {
      if (s) {
        $('[data-toggle="' + s + '"]').stoggle();
      } else {
        //把需要直接载入的模块动态的添加到模块里然后执行直接执行
        var amod = this.sMethods;
        $.each(amod, function(i, n) {
          $.stoggle.addMethod(n.type, n.motion);
          $.stoggle.load(n.type);
        });
      }

    }
  });
  // code
  $.fn.stoggle = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this);
      var eventname = $this.attr("data-toggle");
      var tar = $this.attr("data-target") || "active";
      $.stoggle.methods[eventname] && $.stoggle.methods[eventname]($this, tar);
    });
  };

  // start load
  $.stoggle.load();
  //add event
  $(document).on("click", '[data-toggle]', function(e) {
    $this = $(e.target);
    var eventname = $this.attr("data-toggle"),
      tar;
    if (eventname) {
      tar = $this.attr("data-target") || "active";
    } else {
      var parent = $(this);
      eventname = parent.attr("data-toggle");
      tar = parent.attr("data-target") || "active";
    }
    $.stoggle.methods[eventname] && $.stoggle.methods[eventname]($this, tar);
    e.preventDefault();
  });
}));;/*
 * sValidate 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-05-06
 *
 *
 *
 * pattern 验证
 * required 必填项验证
 * tips
 *
 */

(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [ "jquery" ], factory );
    } else {
        // Browser globals
        factory( jQuery );
    }
}(function( $ ) {
    // code
 $.fn.sValidate = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  this.each(function() {

    var $this = $(this),
      einput = $("input,textarea", $this),
      required = $("input[required],textarea[required],[data-type='required']", $this),
      checkbox = $("input[type=radio],input[type=checkbox]", $this),
      esubmit = $this.find(":submit");
    // Validate obj length
    var count = required.length;
    $this.timeout = null;
    //validation attr
    // var tem_input=document.createElement("input"),
    //    noRequired= !("required" in tem_input),
    //    Nopattern = !("pattern" in tem_input);
    var Validate = {
      //Processing method set class
      validation: function(elem, setClass) {
        var parent = elem.sparent || elem.parent();
        var boole = elem.boole;
        var setClass = parent.hasClass("focus");
        if (boole) {
          elem.attr("data-validation", 1);
          if (setClass) {
            parent.removeClass("error");
            parent.addClass("completed");
          }
        } else {
          elem.attr("data-validation", 0);
          if (setClass) {
            parent.addClass("error");
            parent.removeClass("completed");
          }
        };
      },
      addMod: function() {
        var select = function(_this) {
          var echecked = _this.find(":checked");
          _this.boole = echecked.length;
          //sconsole.log(_this.boole)
          _this.sparent = _this;
          Validate.validation(_this);
        }
        var input = function(_this) {
          _this.pattern = _this.attr("pattern");
          _this.confirmation = _this.attr("data-confirmation");
         _this.value = $.trim(_this.val());

          _this.boole = $.trim(_this.val());
          Validate.validation(_this);
          //pattern
          if (_this.boole && _this.pattern) {
            Validate.pattern(_this);
          }
          if(_this.boole && _this.confirmation){
            console.log(_this)
            Validate.confirmation(_this);
          }

        };

        return {
          select: select,
          input: input
        }
      },
      //Organizing text box
      required: function(ele) {
        var ele = ele || required;
        ele.each(function(index, elem) {
          var _this = $(this);
          var clen = _this.children().length;
          if (clen == 0) {
            Validate.addMod().input(_this);
          } else {
            Validate.addMod().select(_this);
          }
          //ajax
        });
      },
      //regexp 
      pattern: function(elem) {
        var reg = new RegExp(elem.pattern);
        var value = elem.value;
        elem.boole = reg.test(value);
        //console.log(elem.boole)
        this.validation(elem);
      },
      confirmation:function(elem){
           //confirmation password
            var ele = $("#" + elem.confirmation);
            var value = $.trim(ele.val());
             if(value==elem.value){
               elem.boole=true
             }else{
              elem.boole=false;
             }
         this.validation(elem); 
        },
      tips: function() {
        var html = "";
        var ele = $("[data-validation=0]", $this);
        ele.each(function(index, elem) {
          var _this = $(this);
          var txt = _this.next(".tips").text() || _this.attr("data-tips") || ""
          html += txt;
        })
        return html;
      },
      setState: function() {
        this.required();
        var vlen = $("[data-validation=1]", $this).length;
        if (vlen == count) {
          $this.attr("data-state", 1);
          esubmit.removeAttr("disabled");
          //esubmit.removeClass("disabled");
        } else {
          $this.attr("data-state", 0);

          esubmit.attr("disabled", "disabled");
          //esubmit.addClass("disabled");
        }
      },
      init: function() {
        // input event
        required.not("[data-type='required']").on({
          "keyup.sValidate": function(e) {
            var _this = $(this);
            clearTimeout($this.timeout);
            $this.timeout = setTimeout(function() {
              Validate.required(_this);
              Validate.setState();
            }, 150);
          },
          "focus.sValidate": function() {
            var _this = $(this),
              parent = _this.parent();
            parent.addClass("focus");
          },
          "blur.sValidate": function(e) {
            var _this = $(this);
            parent = _this.parent();
            parent.removeClass("focus");
          }
        });
        // active
        checkbox.on("change.sValidate", function() {
          var _this = $(this),
            parent = _this.closest("[data-validation]");
          Validate.required(parent);
          Validate.setState();
        })
        // echeck event
        esubmit.on("click.sValidate", function(e) {
          var _this = $(this);
          if (_this.hasClass("disabled")) {
            return false;
          }
        })
        Validate.setState();
      }
    }
    Validate.init();
    //event
  });
};   
  //data api
  $("[data-event='validate']").sValidate();  
    
    //return $.widget;
}));

