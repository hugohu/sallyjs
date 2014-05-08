/* =========================================================
 * huTab 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2013 Huugle
 *
 * Date: 2013-01-21
 * 滑动门可以实现div切换
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
                var active = child.filter(".active");
                var index = child.index(active);
                $this.data("index", index);
                active.removeClass("active");
            },
            "mouseout": function () {
                var index = $this.data("index");
                input.val(index + 1);
                child.eq(index).addClass("active");
            },
            "click": function (e) {
                var ob = e.target;
                var index = child.index(ob);
                $this.data("index", index);
            }
        });

    });
};
jQuery(function ($) {
    $("[data-event='star']").star();
})