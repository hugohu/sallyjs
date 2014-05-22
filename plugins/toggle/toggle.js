/* =========================================================
 * toggle 0.2
 * http://huugle.org/
 * =========================================================
 * Copyright (c) 2014 Huugle
 *
 * Date: 2014-04-02
 * 关闭提示框
 * ========================================================= */
(function($) {
    $.fn.sallytoggle = function(options) {
      var defaults = {};
      var options = $.extend(defaults, options);
      this.each(function() {
          //code...
          var $this = $(this);
          var tar = $this.attr("data-target");
          var eventName = $this.attr("data-toggle");
          //根据不同的事件名称来绑定不同的事件类型
          var modal = {
            close: function() { //关闭事件,关闭指定的父级元素
              $this.on("click", function(e) {
                $(this).parents("." + tar).fadeOut();
                e.preventDefault();
                e.stopPropagation();
              });
            },
            hover: function() {
              //模拟鼠标划过,添加对应的class
              //$this.ctimes=null;
              $this.on("mouseenter", function() {
                clearTimeout($this.ctimes);
                $this.addClass(tar);
              }).on("mouseleave", function() {
                clearTimeout($this.ctimes);
                $this.ctimes = setTimeout(function() {
                  $this.removeClass(tar);
                }, 0);

              });
            },
            dropdown: function() { //模拟下拉菜单,点击显示点击隐藏
              var son = $this.children("." + tar);
              $this.on("click.dropdown", function(e) {
                son.toggle();
                e.preventDefault();
                e.stopPropagation();
              });
              $(document).on("click.dropdown", function(e) {
                !son.is(":hidden") && son.hide();
              });
            }
          }
            //判断是否为空,不为空就执行绑定事件
            !!modal[eventname] && modal[eventname]();

          });
      };
    })(jQuery);　
  /*  DARA API  */
  jQuery(function($) {
    $('[data-toggle]').sallytoggle();
  });