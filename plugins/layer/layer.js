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
			if (etarget.length != 1) {
				return false;
			}
			if ($(".m-masklayer").length == 0) {
				$("body").append('<div class="m-masklayer"></div>');
			}
			var masklayer = $(".m-masklayer");

			var layer = {
					type: function() {
						// type iframe
						var iframe = etarget.find("iframe");
						if (iframe.length == 1) {
							var href = $this.attr("href");
							iframe.attr("src", href);
							iframe.addClass("active");
							iframe.load(function() {
								iframe.removeClass("active");
								});
						}
						// end
					},
					open: function() {
						this.type();
						body.on('keyup.layer', this.onDocumentKeyup)
							.on("click.layer", this.onDocumentClick)
							.addClass("f-layer-show");
					},
					closed: function() {
						body.off('keyup.layer', this.onDocumentKeyup)
							.off("click.layer", this.onDocumentClick)
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
					}
				}
				//event
			$this.on({
				"click": function(e) {
					layer.open();
					e.preventDefault();
				},
				"mouseover": function() {
					//set offset
					var off = $this.offset();
					etarget.css({
						"left": off.left,
						"top": off.top
					})
				}
			})
			//end !
		});
	};
})(jQuery);

jQuery(function($) {
	$('[data-event="layer"]').layer();
})