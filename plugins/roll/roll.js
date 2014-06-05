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

