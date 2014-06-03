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
							var _this = $(this);
							var Timeout=setTimeout(function() {
								_this.css({
									'transform': translate,
									'-webkit-transform': translate,
									'-moz-transform': translate,
									'-ms-transform': translate,
									'-o-transform': translate
								})
							}, delay)
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

      $.fn.layer = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this),
        body = $('body'),
        _target = $this.attr("data-target"),
        etarget = $("#" + _target);
      $this.outime = null;
      if (etarget.length != 1) {
        return false;
      }
      if ($(".m-masklayer").length == 0) {
        $("body").append('<div class="m-masklayer"></div>');
      }
      var masklayer = $(".m-masklayer");

      var layer = {
          type: function(status) {
            // type iframe
            var iframe = etarget.find("iframe");
            if (iframe.length == 1) {
              if (status == "open") {
                var loading = $("#loading");
                loading.addClass("active");
                var href = $this.attr("href");
                clearTimeout($this.outime);
                $this.outime = setTimeout(function() {
                  iframe.attr("src", href);
                  iframe.load(function() {
                    loading.removeClass("active");
                  })
                }, 360)
              };
              if (status == "closed") {
                iframe.attr("src", "");
              }
            }
            // end
          },
          open: function() {
            this.type("open");
            body.on('keyup', this.onDocumentKeyup)
              .on("click", this.onDocumentClick)
              .addClass("f-layer-show");
          },
          closed: function() {
            this.type("closed");
            body.off('keyup', this.onDocumentKeyup)
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
            var scrollTop = $(window).scrollTop()
            var _Top = off.top - scrollTop;
            etarget.css({
              "left": off.left,
              "top": _Top
            })
          }
        }
        //event
      $(document).on("click", '[data-event="layer"]', function(e) {
        layer.setoff($(this))
        layer.open();
        e.preventDefault();
      }).on("mouseover", '[data-event="layer"]', function() {
        layer.setoff($(this));
      })

      //end !
    });
  };
  //DATA API
$('[data-event="layer"]').layer();  
   // return $.widget;

}));

;/*
 * huFloat 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2013-01-22
 * DIV切换
 */
/*
 * roll 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-05-06
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
  // code
  $.fn.roll = function(options) {
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
          this.top = $(window).height();
          $this.on("click", function(e) {
            build.setTop()
            e.preventDefault();
          });
          this.top = 500;
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

  // data api
  $("[data-roll]").roll();
  //return $.widget;
}));;/* =========================================================
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
;/* =========================================================
 * toggle 0.2
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2014 Huugle
 *
 * Date: 2014-04-02
 * 关闭提示框
 * ========================================================= */
(function($) {
    $.fn.sallytoggle = function(options) {
      var defaults = {};
      var options = $.extend(defaults, options);
      this.each(function() {
          //code...
          var $this = $(this);
          var tar = $this.attr("data-target");
          var eventName = $this.attr("data-toggle");
          //根据不同的事件名称来绑定不同的事件类型
          var modal = {
            close: function() { //关闭事件,关闭指定的父级元素
              $this.on("click", function(e) {
                $(this).parents("." + tar).fadeOut();
                e.preventDefault();
                e.stopPropagation();
              });
            },
            hover: function() {
              //模拟鼠标划过,添加对应的class
              //$this.ctimes=null;
              $this.on("mouseenter", function() {
                clearTimeout($this.ctimes);
                $this.addClass(tar);
              }).on("mouseleave", function() {
                clearTimeout($this.ctimes);
                $this.ctimes = setTimeout(function() {
                  $this.removeClass(tar);
                }, 0);

              });
            },
            dropdown: function() { //模拟下拉菜单,点击显示点击隐藏
              var son = $this.children("." + tar);
              $this.on("click.dropdown", function(e) {
                son.toggle();
                e.preventDefault();
                e.stopPropagation();
              });
              $(document).on("click.dropdown", function(e) {
                !son.is(":hidden") && son.hide();
              });
            }
          }
            //判断是否为空,不为空就执行绑定事件
            !!modal[eventname] && modal[eventname]();

          });
      };
    })(jQuery);　
  /*  DARA API  */
  jQuery(function($) {
    $('[data-toggle]').sallytoggle();
  });;/*
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

