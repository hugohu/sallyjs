/*
 * layer 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-01-21
 * layer
 */
(function($) {
  $.fn.layer = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this),
        body = $('body'),
        _target = $this.attr("data-target"),
        etarget = $("#" + _target);
      $this.outime = null;
      if (etarget.length != 1) {
        return false;
      }
      if ($(".m-masklayer").length == 0) {
        $("body").append('<div class="m-masklayer"></div>');
      }
      var masklayer = $(".m-masklayer");

      var layer = {
          type: function(status) {
            // type iframe
            var iframe = etarget.find("iframe");
            if (iframe.length == 1) {
              if (status == "open") {
                var loading = $("#loading");
                loading.addClass("active");
                var href = $this.attr("href");
                clearTimeout($this.outime);
                $this.outime = setTimeout(function() {
                  iframe.attr("src", href);
                  iframe.load(function() {
                    loading.removeClass("active");
                  })
                }, 360)
              };
              if (status == "closed") {
                iframe.attr("src", "");
              }
            }
            // end
          },
          open: function() {
            this.type("open");
            body.on('keyup', this.onDocumentKeyup)
              .on("click", this.onDocumentClick)
              .addClass("f-layer-show");
          },
          closed: function() {
            this.type("closed");
            body.off('keyup', this.onDocumentKeyup)
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
            var scrollTop = $(window).scrollTop()
            var _Top = off.top - scrollTop;
            etarget.css({
              "left": off.left,
              "top": _Top
            })
          }
        }
        //event
      $(document).on("click", '[data-event="layer"]', function(e) {
        layer.setoff($(this))
        layer.open();
        e.preventDefault();
      }).on("mouseover", '[data-event="layer"]', function() {
        layer.setoff($(this));
      })

      //end !
    });
  };
})(jQuery);

jQuery(function($) {
	$('[data-event="layer"]').layer();
})