/* =========================================================
 * huTab 0.1
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2013 Huugle  
 *
 * Date: 2013-01-21
 * 滑动门可以实现div切换
 * ========================================================= */
(function ($) {
    $.fn.tab = function (options) {

        this.each(function () {
            //code...
            var $this=$(this),
            eli=$this.children(),
            _target=$this.attr("data-target"),
            etarget=$(_target),
            $event = ($this.attr("data-type")) || "mouseover";
            function Setactive(){
                 
                var index=eli.index(this);
                $(this).addClass("active").siblings().removeClass("active");
                etarget.eq(index).addClass("active").siblings().removeClass("active");
             console.log(index)
           }
            //event
        eli.on($event,Setactive);
        });
    };
})(jQuery);

/*  DARA API  */
jQuery(function ($) {
  $('[data-event="tab"]').tab();
});
