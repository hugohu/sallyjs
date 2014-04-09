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
					HEIGTH_THIS = $this.height(),
					WIDTH_THIS = $this.width(),
					TOP = $this.offset().top;
					//SETHTML
					$this.wrap('<div style="width:' + WIDTH_THIS + 'px; height:' + HEIGTH_THIS + 'px;position:relative">' + '</div>');
				},
				gotop: function() {
					$(this).on("click", function(e) {
						$("html, body").animate({
							scrollTop: 0
						}, 120);
						e.preventDefault();
					});
					var TOP = 0;
				}
			};
			function setFiexd() {
						var st = $(window).scrollTop();
						if (st > TOP) {
							$this.addClass(_target);
						} else {
							$this.removeClass(_target);
						}
					}
			build[_event] && build[_event]();
			//event
			$(document).on("scroll",$.throttle(37, setFiexd));
		});
	};
})(jQuery);
jQuery(function() {
	$("[data-roll]").roll();
});