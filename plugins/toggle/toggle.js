/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-06-4
 * layer
 *  思路说明:可以用addMethod的方法添加补充事件,比如
 *  $.stoggle.addMethod({name},{f})
 *  其中name为模块名称,f为匿名函数.
 *  如果不是click事件,请在结尾处添加 $.stoggle.load({name});
 *  click事件直接写具体事件$.stoggle.addMethod({name},function($this,tar){ //code })
 *  $this 为触发事件的元素
 *  tar为触发元素自定义属性 data-target 里的字符串.
 *  通常用于自定义切换样式等.
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
          return false
        }
        var _id = $(href);
        var TOP = parseInt(_id.offset().top) - 70;
        $("html, body").animate({
          scrollTop: TOP
        }, 500);
      },
      tclass: function($this, tar) {
        $this.toggleClass(tar)
      },
      alert: function($this) {
        $this.parent().hide();
      }
    },
    sMethods: [{
      type: "hover",
      motion: function($this, tar) {
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
  })

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
    parent = $this.parent();
    var eventname = $this.attr("data-toggle") || parent.attr("data-toggle");
    var tar = $this.attr("data-target") || parent.attr("data-target") || "active";
    $.stoggle.methods[eventname] && $.stoggle.methods[eventname]($this, tar);
    e.preventDefault();
  });
}));