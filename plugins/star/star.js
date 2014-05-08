/* =========================================================
 * star 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2014 Huugle
 *
 * Date: 2013-01-21
 * 选择星星
 * ========================================================= */
//star
jQuery.fn.star = function (options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    // options fn 
    this.each(function () {
        //code...
        var $this = $(this);
        var child = $this.children();
        var input = $this.find("input");
        $this.on({
            "mouseover": function () {
                var eActive = child.filter(".active"),
                    index = child.index(eActive);
                $this.data("index", index);
                eActive.removeClass("active");
            },
            "mouseout": function () {
                var index = $this.data("index"),
                eActive=child.eq(index),
                value=eActive.attr("data-value");
                input.val(value);
                eActive.addClass("active");
            },
            "click": function (e) {
                var eTarget = e.target;
                var index = child.index(eTarget);
                $this.data("index", index);
            }
        });

    });
};
jQuery(function ($) {
    $("[data-event='star']").star();
})