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

     $.fn.sallytoggle = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this);
      var tar = $this.attr("data-target") || "active";
      var eventname = $this.attr("data-toggle");
      var modal = {
        hover: function() {
          $this.on("mouseover", function() {
            clearTimeout($this.ctimes);
            $this.ctimes = setTimeout(function() {
              $this.addClass(tar)
            }, 250);
          }).on("mouseout", function() {
            clearTimeout($this.ctimes);
            $this.ctimes = setTimeout(function() {
              $this.removeClass(tar);
            }, 0);
          });
        },
        colsed: function() {
          $this.on("click", function() {
            $(this).parent().hide(350);
          })
        },
        anchor: function() {
          var is_a = !!$this.attr("href");
          var ele = is_a ? $this : ($("a", $this));
          //event
          ele.on("click", function(e) {
            var _this = $(this);
            var href = $(this).attr("href");
            var _id = $(href);
            var TOP = parseInt(_id.offset().top) - 70;
            $("html, body").animate({
              scrollTop: TOP
            }, 500);
            e.preventDefault()
          })

        },
        actived: function() {
          var child = $this.children();
          var item = child.not(".disabled");
          item.on("click", function(e) {
            $(this).addClass(tar).siblings().removeClass(tar);
          })
        },
        tclass: function() {
          $this.on("click", function() {
            $this.toggleClass(tar)
          })
        },
        loading: function() {
          var text = $this.attr("data-loading-text");
          var value = $this.val() || $this.text();
          $this.on("click", function() {
            var _this = $(this);
            _this.attr("disabled", "disabled");
            _this.val(text);
            var load_timout = setTimeout(function() {
              _this.removeAttr("disabled");
              _this.val(value);
            }, 1000);
          })
        },
        state: function() {
          var count = $(".i-count", $this),
            numb = parseInt(count.html());
          if (numb >= 3) {
            $this.addClass(tar);
          }
        }
      };
      modal[eventname]();
    });
  };
  //DATA API
$('[data-toggle]').sallytoggle();
   // return $.widget;

}));

