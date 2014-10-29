/* =========================================================
 * tab load
 * ========================================================= */


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
    var Tab = function($this) {
        var _this = $this;
        _this.ehead = $("[data-tab='hd']", $this).children();
        _this.ebody = $("[data-tab='bd']", $this).children();
        _this.led = $("[data-tab='led']", $this);
        _this.$event = ($this.attr("data-type")) || "mouseover";
        _this.timeout = 100;
        _this.isNotSupportTranslate = function() {
            var isIE9_ = document.all && !window.atob
            return !!isIE9_;
        }
        _this.setTranslate = function(el, dis) {
            'use strict';
            var es = el.style;
            var transformString = 'translate(' + dis + 'px,0px)  translateZ(0px)'
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        }
        _this.move = function(dix, width) {
            if (_this.isNotSupportTranslate()) {
                _this.led.animate({
                    "left": dix,
                    "width": width
                }, 350)
            } else {
                var el = _this.led[0];
                el.style.width = width + "px"
                _this.setTranslate(el, dix)
            }
        }
        _this.init = function() {
            if (_this.led.length == 1) {
              var sWidth = _this.ehead.eq(0).width();
            _this.move(0, sWidth);  
            }
        }
        _this.init()
        //event
        _this.ehead.not("[data-tab='led']").on(_this.$event, function(e) {
            var $this = $(this);
            if (_this.led.length == 1) {
                var dix = parseInt($this.position().left)
                var width = $this.width()
                _this.move(dix, width)
            }
            var index = _this.ehead.index(this);
            $this.addClass("active").siblings().removeClass("active");
            _this.ebody.eq(index).addClass("active").siblings().removeClass("active");
        });
    }

    $.fn.tab = function(options) {
        this.each(function() {
            //code...
            var s = new Tab($(this));
            $(this).data('tab', s);
            return s;
            //event

        });
    };
    /*  DARA API  */
    $('[data-event="tab"]').tab();
    //return $.widget;
}));