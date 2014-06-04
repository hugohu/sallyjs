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

}));