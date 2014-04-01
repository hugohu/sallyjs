/*
 * huFloat 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2013-01-22
 * DIV切换
 */
(function($) {
	$.fn.fixed = function(options) {
		this.each(function() {
			var $this = $(this),
				_target = $this.attr("data-target") || "active",
				_event = $this.attr("data-event");
			switch (_event) {
				case "fixed":
					HEIGTH_THIS = $this.height(),
					WIDTH_THIS = $this.width(),
					TOP = $this.offset().top;
					//SETHTML
					$this.wrap('<div style="width:' + WIDTH_THIS + 'px; height:' + HEIGTH_THIS + 'px;position:relative">' + '</div>');
					break;
				case "gotop":
					$(this).on("click", function(e) {
						$("html, body").animate({
							scrollTop: 0
						}, 120);
						e.preventDefault();
					});
					var TOP = 0;
			}

			function setFiexd() {
				var st = $(window).scrollTop();
				if (st > TOP) {
					$this.addClass(_target);
				} else {
					$this.removeClass(_target);
				}
			}
			//event
			$(document).scroll($.throttle(37, setFiexd));
		});
	};
})(jQuery);
jQuery(function() {
	$("[data-event='fixed']").fixed();
	$("[data-event='gotop']").fixed();
});