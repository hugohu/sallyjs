/* =========================================================
 * huTab 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2013 Huugle
 *
 * Date: 2013-01-21
 * 滑动门可以实现div切换
 * ========================================================= */
(function($) {
    $.fn.tab = function(options) {
        this.each(function() {
            //code...
            var $this = $(this),
                ehead = $(".tab-hd", $this).children(),
                ebody = $(".tab-bd", $this).children(),
                $event = ($this.attr("data-type")) || "mouseover";

            function Setactive() {
                var index = ehead.index(this);
                $(this).addClass("active").siblings().removeClass("active");
                ebody.eq(index).addClass("active").siblings().removeClass("active");
            }
            //event
            ehead.on($event, Setactive);
        });
    };
})(jQuery);

/*  DARA API  */
jQuery(function($) {
    $('[data-event="tab"]').tab();
});