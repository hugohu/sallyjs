/*
 * toggle 0.2
 * Copyright (c) 2014 Huugle  http://sallyjs.huugle.org/
 * Date: 2014-06-04
 *
 *  思路说明:可以直接像stoggle内添加事件方法.
 *  $.stoggle("name",fn($this,tar){})
 *  其中name为模块名称,f为匿名函数.
 *  如果不是click事件,请在结尾处添加 $.stoggle.load({name});
 *  click可以直接进行绑定 并用 data-toggle-click="name",进行绑定
 *  click事件直接写具体事件$.stoggle({name},function($this,e,tar){ //code })
 *  $this 为触发事件的元素
 *  tar为触发元素自定义属性 data-target 里的字符串.
 *  e为e 可以取消默认事件用
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
  $.stoggle = function(eventanme, fn) {
    $.stoggle[eventanme] = fn;
  };
  $.extend($.stoggle, {
    alert: function($this, e, tar) {
      $this.parent().hide(350);
    },
    window:function($this, e){
      var _this = $(e.target);
      var url = _this.attr("href");
      var width=_this.attr("data-width")*1;
       var height=_this.attr("data-height")*1;
      var screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
    var screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
    var outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth;
    var outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22);
    var left = parseInt(screenX + ((outerWidth - width) / 2), 10);
    var top = parseInt(screenY + ((outerHeight - height) / 2.5), 10);
    var settings = (
        'width=' + width +
            ',height=' + height +
            ',left=' + left +
            ',top=' + top
        );
      var newwindow = window.open(url, '', settings);
    if (window.focus) {
        newwindow.focus()
    }
      e.preventDefault();
    },
    actived: function($this, e, tar) {
      var _this = $this.children();
      _this.addClass(tar).siblings().removeClass(tar);
    },
    anchor: function($this, e) {
      var _this = $(e.target);
      var href = _this.attr("href");
      if (!href) {
        return false;
      }
      var _id = $(href);
      var TOP = parseInt(_id.offset().top) - 70;
      $("html, body").animate({
        scrollTop: TOP
      }, 500);
      e.preventDefault()
    },
    tclass: function($this, e, tar) {
      $this.toggleClass(tar);
    },
    closed: function($this, e, tar) {
      $this.closest(tar).removeClass("active");
    },
    timeout: function(obj) {
      obj.start();
      obj.tiemout = setTimeout(function() {
        obj.stop();
      }, obj.delay);
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
          }, 200);
        });
      }
    }],
    load: function(s) {
      if (s) {
        $('[data-toggle="' + s + '"]').stoggle();
      } else {
        //把需要直接载入的模块动态的添加到模块里然后执行直接执行
        $.each(this.sMethods, function(i, n) {
          $.stoggle(n.type, n.motion);
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
      $.stoggle[eventname] && $.stoggle[eventname]($this, tar);
    });
  };

  // start load
  $.stoggle.load();
  //add event
  $(document).on("click", '[data-toggle-click]', function(e) {

    var $this = $(this);
    var tar = $this.attr("data-target") || "active";
    var eventname = $this.attr("data-toggle-click")
    $.stoggle[eventname] && $.stoggle[eventname]($this, e, tar);
  });
}));