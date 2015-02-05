/* =========================================================
 * huTab 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2013 Huugle
 *
 * Date: 2013-01-21
 * 滑动门可以实现div切换
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
  $.fn.placeholder = function(options) {
    this.each(function() {
      var _this = $(this);
      var text = _this.attr("placeholder");
      _this.val(text).focus(function() {
        if (_this.val() === _this.attr("placeholder")) {
          _this.val("");
        };
      }).blur(function() {
        if (_this.val().length === 0) {
          _this.val(_this.attr("placeholder"));
        };
      });
    })
  };
/*  DARA API  */
$(function() {
  var input = $("input[placeholder]");
  if (!("placeholder" in document.createElement("input"))) {
    input.placeholder();
  };
})
  
}));
