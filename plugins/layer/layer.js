/*
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
  var Layer = function($this, params) {
    var _this = this;
    _this.$this = $this;
    _this.dataSet = _this.$this.attr("data-set");
    _this.set = _this.dataSet ? $.parseJSON(_this.dataSet) : {};
    var defaults = {
      json: {},
      target: "",
      fn: {},
      type: "layer",
      position:true
    };
    /**
     * [params 载入参数]
     * @type {[object]}
     * @描述 三部分,默认参数,用户data-set 里的参数或者直接调用的参数.
     */
    _this.params = $.extend(defaults, params || _this.set);

    _this.target = _this.params["target"] || _this.$this.attr("data-target");
    _this.json = _this.params["json"];
    _this.showbox = $("#" + _this.target);
    _this.type = _this.params["type"];
    _this.isclosed = true;
    _this.run = function(name) {
      //callback
      _this.params["fn"][name] && _this.params["fn"][name]();
      //plugins
      var fn = _this.plugins[_this.type];
      fn && fn[name] && fn[name].apply(this)
    },
    _this.open = function() {
      $("body").on('keyup', this.onDocumentKeyup)
        .on("click", this.onDocumentClick)
        .addClass("f-layer-show "+_this.type+"-show");
      _this.run("open");
    }
    _this.closed = function() {
      _this.run("closed");
      if (_this.isclosed) {
        $("body").off('keyup', this.onDocumentKeyup)
          .off("click", this.onDocumentClick)
          .removeClass("f-layer-show "+_this.type+"-show");
      }
    }
    _this.onDocumentKeyup = function(e) {
      if (e.keyCode === 27) {
        _this.closed();
      }
    }
    _this.onDocumentClick = function(e) {
      if ($(e.target).is('[data-event="close"],.m-masklayer')) {
        e.preventDefault();
        _this.closed();
      }
    }

    _this.init = function() {
      if ($(".m-masklayer").length == 0) {
        $("body").append('<div class="m-masklayer"></div>');
      }
      _this.run("init");
      if (_this.showbox.length == 0) {
        var templ = $("#templ-" + _this.target);
        var templ_html = templ.html();
        if (!$.isEmptyObject(_this.json)) {
          templ_html = _this.format(templ_html, _this.json);
        }
        $("body").append(templ_html);
        _this.showbox = $("#" + _this.target);
      }
      if(_this.params["position"]){
        var off = $this.offset();
      var scrollTop = $(window).scrollTop();
      var _Top = off.top - scrollTop;
      _this.showbox.css({
        "left": off.left,
        "top": _Top
      })
      }
      _this.run("start");
      var timeout = setTimeout(function() {
        _this.showbox.addClass("active");
        _this.open();
      }, 150)

    }
    _this.init();
  }
  $.layer = function(typeName, fn) {
    $.layer[typeName] = fn;
  }
  Layer.prototype = {
    plugins: $.layer,
    format: function(template, json) {
      return template.replace(/\{\{(.*?)\}\}/g, function(all, key) {
        return json && (key in json) ? json[key] : "";
      });
    }
  }

  $.fn.layer = function(params) {
    //code
    var s = new Layer($(this), params);
    $(this).data('layer', s);
    return s;
  };
  //DATA API
  $(document).on("click", '[data-event="layer"]', function(e) {
    $(this).layer();
    e.preventDefault();
  })
  // return $.widget;

}));

/***=======================  扩展插件写法说明 ============*******/
/**
 *
 * $.layer({"type",{})
 * type为类型名,应该与点击展开时所书写的类型参数一致才会触发对应的内容.
 * 每个插件里有4个状态:
 * 写在后面的{}里.分别是
 * {"init": 刚点击,模板未展开时候的状态,
 * "start":模板转载时状态
 * "open":弹窗展开之后
 * "closed":"弹窗关闭时"
 * }
 * 其中插件中的this指向为Layer函数.所以可以直接使用对应的方法.属性.
 * 默认为layer
 */