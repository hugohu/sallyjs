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
jQuery.fn.ajaxsubmit = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  // options fn 
  this.each(function() {
    //code...
    var set_data = options.data;
    var $this = $(this),
      adata = set_data ? ($this.serialize() + set_data) : $this.serialize();
    action = this.action,
    method = this.method;
    $.ajax({
      type: method,
      url: action,
      data: adata,
      success: options.success,
      statusCode: options.code
    });
  });
};

  //DATA API
//$("[data-event='ajaxsubmit']").ajaxsubmit();
   // return $.widget;

}));

