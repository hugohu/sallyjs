/*
 * sValidate 0.1
 * Copyright (c) 2013 Huugle  http://huugle.org/
 * Date: 2014-05-06
 *
 *
 *
 * pattern 验证
 * required 必填项验证
 * tips
 *
 */
jQuery.fn.sValidate = function (options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  this.each(function () {

    var $this = $(this),
      einput = $("input", $this),
      required = $("[required]", $this),
      echeck = $("[data-type='required']", $this),
      esubmit = $this.find(":submit");
    // Validate obj length
    var count = required.length + echeck.length;
    //verification attr
    // var tem_input=document.createElement("input"),
    // 		noRequired= !("required" in tem_input),
    // 		Nopattern = !("pattern" in tem_input);
    var Validate = {
      verification: function (elem) {
        var parent = elem.sparent || elem.parent();

        var boole = elem.boole;
        //console.log(boole)
        if (boole) {
          parent.removeClass("error");
          parent.addClass("completed");
        } else {
          parent.addClass("error");
          parent.removeClass("completed");
          return false;
        }
      },
      required: function () {
        required.each(function (index, elem) {
          var _this = $(this);
          Validate.vali(_this);
        });
      },
      echecked: function () {
        echeck.each(function (index, elem) {
          var _this = $(this);
          var echecked = _this.find(":checked");
          _this.boole = echecked.length;
          _this.sparent = _this;
          Validate.verification(_this);
        });
      },
      vali: function (elem) {
        
        elem.pattern = elem.attr("pattern");
        elem.value = $.trim(elem.val());
        //required
          elem.boole = $.trim(elem.val());
          Validate.verification(elem);
        //pattern
        if (elem.pattern) {
          Validate.pattern(elem);
        }
      },
      pattern: function (elem) {
        var reg = new RegExp(elem.pattern);
        var value = elem.value;
        elem.boole = reg.test(value);
        //console.log(elem.boole)
        this.verification(elem);
      },
      init: function () {
        // input event
        einput.on({
          "focus": function () {
            var _this = $(this),
              parent = _this.parent();
            parent.addClass("focus");
          },
          "blur": function (e) {
            var _this = $(this),
              isRequired = _this.attr("required"),
              parent = _this.parent();
              parent.removeClass("focus");
            //
            if(isRequired){
               Validate.vali(_this);
            }
           
          }
        });
        // echeck event
        esubmit.on("click.Validate", function (e) {
          Validate.required();
          Validate.echecked();
          var completed_len = $(".completed", $this).length;
          if (completed_len == count) {
            $this.data("state", 1);
          } else {
            $this.data("state", 0);
            return false;
          }
        })
      }
    }
    Validate.init();
    //event

  });
};

//ajaxform
jQuery.fn.ajaxsubmit = function (options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  // options fn 
  this.each(function () {
    //code...
    var set_data = options.data;
    var $this = $(this),
      adata = set_data ? ($this.serialize() + set_data) : $this.serialize();
    action = this.action,
    method = this.method;
    $.ajax({
      type: method,
      url: action,
      data: adata,
      success: options.success,
      statusCode: options.code
    });
  });
};

jQuery(function () {
  $("[data-event='validate']").sValidate();
  esubmit = $(":submit");
  esubmit.on("click", function (e) {
    var form = $(this).parents("form");
    var isok = form.data("state");
    if (isok) {
      form.ajaxsubmit();
      e.preventDefault();
    }
  })
});