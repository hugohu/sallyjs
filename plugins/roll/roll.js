/* =========================================================
 * roll load
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
          var inViews = [];
          $this.data("index", 0);
          ele.each(function(index, elem) {
            var _Id = $(this).attr("href");
            if ($(_Id).length) {
              inViews.push($(_Id));
            }
          });

          function setActived(id) {
            ele.removeClass("active");
            $("a[href=#" + id + "]").addClass("active");
          }

          function setfollow() {
            var scrollTop = $(window).scrollTop();
            if (inViews.length) {
              var $target;
              $.each(inViews, function(i, item) {
                console.log(item.offset().top, scrollTop)
                if (item.offset().top >= scrollTop) {
                  $target = item;
                  return false; // break
                }
              });
              if (!$target) {
                return;
              }
              var id = $target.attr("id");
              setActived(id)
            }
          }
          var delay = 50;
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
  $(function(){
      $("[data-roll]").roll();
  })

  // return $.widget;

}));