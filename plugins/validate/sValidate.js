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

(function(factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {
  // code
  $.fn.sValidate = function(options) {
    var defaults = {};
    var options = $.extend(defaults, options);
    this.each(function() {
      var $this = $(this),
        einput = $("input,textarea", $this),
        required = $("input[required],textarea[required],[data-type='required']", $this),
        checkbox = $("input[type=radio],input[type=checkbox]", $this),
        esubmit = $this.find(":submit");
      // Validate obj length
      var count = required.length;
      $this.timeout = null;
      //validation attr
      // var tem_input=document.createElement("input"),
      //    noRequired= !("required" in tem_input),
      //    Nopattern = !("pattern" in tem_input);
      var Validate = {
        //Processing method set class
        validation: function(elem, setClass) {
          var parent = elem.sparent || elem.parent();
          var boole = elem.boole;
          var setClass = parent.hasClass("focus");
          if (boole) {
            elem.attr("data-validation", 1);
            if (setClass) {
              parent.removeClass("error");
              parent.addClass("completed");
            }
          } else {
            elem.attr("data-validation", 0);
            if (setClass) {
              parent.addClass("error");
              parent.removeClass("completed");
            }
          };
        },
        addMod: function() {
          var select = function(_this) {
            var echecked = _this.find(":checked");
            _this.boole = echecked.length;
            //sconsole.log(_this.boole)
            _this.sparent = _this;
            Validate.validation(_this);
          }
          var input = function(_this) {
            _this.pattern = _this.attr("pattern");
            _this.confirmation = _this.attr("data-confirmation");
            _this.value = $.trim(_this.val());

            _this.boole = $.trim(_this.val());
            Validate.validation(_this);
            //pattern
            if (_this.boole && _this.pattern) {
              Validate.pattern(_this);
            }
            if (_this.boole && _this.confirmation) {
              Validate.confirmation(_this);
            }

          };

          return {
            select: select,
            input: input
          }
        },
        //Organizing text box
        required: function(ele) {
          var ele = ele || required;
          ele.each(function(index, elem) {
            var _this = $(this);
            var clen = _this.children().length;
            if (clen == 0) {
              Validate.addMod().input(_this);
            } else {
              Validate.addMod().select(_this);
            }
            //ajax
          });
        },
        //regexp 
        pattern: function(elem) {
          var reg = new RegExp(elem.pattern);
          var value = elem.value;
          elem.boole = reg.test(value);
          //console.log(elem.boole)
          this.validation(elem);
        },
        confirmation: function(elem) {
          //confirmation password
          var ele = $("#" + elem.confirmation);
          var value = $.trim(ele.val());
          if (value == elem.value) {
            elem.boole = true
          } else {
            elem.boole = false;
          }
          this.validation(elem);
        },
        tips: function() {
          var html = "";
          var ele = $("[data-validation=0]", $this);
          ele.each(function(index, elem) {
            var _this = $(this);
            var txt = _this.next(".tips").text() || _this.attr("data-tips") || ""
            html += txt;
          })
          return html;
        },
        setState: function() {
          this.required();
          var vlen = $("[data-validation=1]", $this).length;
          if (vlen == count) {
            $this.attr("data-state", 1);
            esubmit.removeAttr("disabled");
            //esubmit.removeClass("disabled");
          } else {
            $this.attr("data-state", 0);
            esubmit.attr("disabled", "disabled");
            //esubmit.addClass("disabled");
          }
        },
        init: function() {
          // input event
          required.not("[data-type='required']").on({
            "keyup.sValidate": function(e) {
              var _this = $(this);
              clearTimeout($this.timeout);
              $this.timeout = setTimeout(function() {
                Validate.required(_this);
                Validate.setState();
              }, 150);
            },
            "focus.sValidate": function() {
              var _this = $(this),
                parent = _this.parent();
              parent.addClass("focus");
            },
            "blur.sValidate": function(e) {
              var _this = $(this);
              parent = _this.parent();
              parent.removeClass("focus");
            }
          });
          // active
          checkbox.on("change.sValidate", function() {
            var _this = $(this),
              parent = _this.closest("[data-validation]");
            Validate.required(parent);
            Validate.setState();
          })
          // echeck event
          esubmit.on("click.sValidate", function(e) {
            var _this = $(this);
            if (_this.hasClass("disabled")) {
              return false;
            }
          })
          Validate.setState();
        }
      }
      Validate.init();
      //event
    });
  };
  //data api
$(function(){
    $("[data-event='validate']").sValidate();
})

  //return $.widget;
}));