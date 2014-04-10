/*
 * huFloat 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2013-01-22
 * DIV切换
 */
(function($) {
	$.fn.roll = function(options) {
		this.each(function() {
			var $this = $(this),
				_target = $this.attr("data-target") || "active",
				_event = $this.attr("data-roll");
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
				gotop: function() {
					$(this).on("click", function(e) {
						$("html, body").animate({
							scrollTop: 0
						}, 120);
						e.preventDefault();
					});
					this.top = 0,
					delay = 37;
					this.start(delay, this.setFiexd);
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
					$(document).on("scroll", $.throttle(delay, f));
				}
			};

			build[_event] && build[_event]();
			//event
		});
	};
})(jQuery);
jQuery(function() {
	$("[data-roll]").roll();
});