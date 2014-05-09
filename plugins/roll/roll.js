/*
 * huFloat 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2013-01-22
 * DIV切换
 */
/*
 * roll 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-05-06
 * 
 */

  jQuery.fn.roll = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this),
        _target = $this.attr("data-target") || "active",
        _event  = options.event || $this.attr("data-roll");
    var build = {
      fixed: function () {
        var HEIGTH_THIS = $this.height(),
          WIDTH_THIS = $this.width(),
          delay = 37;
        this.top = $this.offset().top;
        //SETHTML
        $this.wrap('<div style="width:' + WIDTH_THIS + 'px; height:' + HEIGTH_THIS + 'px;position:relative">' + '</div>');
        this.start(delay, this.setFiexd);
      },
      follow: function () {
        var ele = $("a", $this);
        var obj = {};
        $this.data("index",0);
        obj.length = ele.length-1;
        ele.each(function (index, elem) {
          var _Id = $(this).attr("href")
          var _TOP = parseInt($(_Id).offset().top)-90;
          obj[index] = {
            index:index,
            id:_Id,
            top: _TOP
          }
        });
        function setActived(index){
          ele.removeClass("active");
          ele.eq(index).addClass("active");
        }
        function setfollow() {
          var index =$this.data("index");
          var inext=(index+1 > obj.length) ? obj.length : index+1;
          var iprev= (index-1 < 0) ? 0 : index-1;
          var _aNext=obj[inext];
          var _aPrev=obj[iprev];
          var _aTop = obj[index].top;
          
          var st = $(window).scrollTop();
          if (st > _aTop && st < _aNext.top) {
            setActived(index);
          } else if (st < _aTop && st > _aPrev.top) {
            $this.data("index",_aPrev.index)
            setActived(_aPrev.index)
          } else if (st > _aNext.top) {
           $this.data("index",_aNext.index)
            setActived(_aNext.index)
          }
        }
        var delay = 37;
        this.start(delay, setfollow);
      },
      gotop: function () {
        $this.on("click", function (e) {
         build.setTop()
          e.preventDefault();
        });
        this.top = 0;
        var  delay = 37;
        this.start(delay, this.setFiexd);
      },
      setTop:function(){
        $("html, body").animate({
            scrollTop: 0
          }, 120);
      },
      setFiexd: function () {
        var st = $(window).scrollTop();
        if (st > build.top) {
          $this.addClass(_target);
        } else {
          $this.removeClass(_target);
        }
      },
      start: function (delay, f) {
        f();
        $(document).on("scroll", $.throttle(delay, f));
      }
    };
      build[_event] && build[_event]();
      //event
    });
  };
jQuery(function() {
  $("[data-roll]").roll();
});