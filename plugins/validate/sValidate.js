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
jQuery.fn.sValidate = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  this.each(function() {

    var $this = $(this),
      einput = $("input,textarea", $this),
      required = $("input[required],textarea[required],[data-type='required']", $this),
      esubmit = $this.find(":submit");
    // Validate obj length
    var count = required.length;
    //validation attr
    // var tem_input=document.createElement("input"),
    // 		noRequired= !("required" in tem_input),
    // 		Nopattern = !("pattern" in tem_input);
    var Validate = {
      //Processing method set class
      validation: function(elem,setClass) {
      var parent = elem.sparent || elem.parent();
        var boole = elem.boole;
         var setClass=parent.hasClass("focus");
        if (boole) {
          elem.attr("data-validation", 1);
          if(setClass){
              parent.removeClass("error");
          parent.addClass("completed");
          }
        } else {
          elem.attr("data-validation", 0);
          if(setClass){
                      parent.addClass("error");
          parent.removeClass("completed");
          }
        };
      },
      setClass: function(elem) {
        
        var boole = elem.boole;
        if (boole && setClass) {
          
        } else {

          return false;
        }
      },
      addMod: function() {
        var select=function(_this) {
          var echecked = _this.find(":checked");
          _this.boole = echecked.length;
          _this.sparent = _this;
          Validate.validation(_this);
        }
        var input =function(_this) {
          _this.pattern = _this.attr("pattern");
          _this.value = $.trim(_this.val());
          //required
          _this.boole = $.trim(_this.val());
          Validate.validation(_this);
          //pattern
          if (_this.boole && _this.pattern) {
            Validate.pattern(_this);
          }
        }
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
          var clen=_this.children().length;
          if ( clen == 0) {
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
       tips:function(){
        var html="";
        var ele=$("[data-validation=0]", $this);
        ele.each(function (index, elem) {
          var _this=$(this);
          var txt=_this.next(".tips").text() || _this.attr("data-tips") || ""
            html+=txt+"<br />";
        })
        return html;
      },
      setState:function(){
        this.required();
        var vlen=$("[data-validation=1]",$this).length;
        if(vlen==count){
           $this.attr("data-state", 1);
          esubmit.removeClass("disabled");
        } else{
          console.log(this.tips())
         $this.attr("data-state", 0);
          esubmit.addClass("disabled");
        }
      },
      init: function() {
        // input event
        einput.on({
          "focus": function() {
            var _this = $(this),
              parent = _this.parent();
            parent.addClass("focus");
          },
          "blur": function(e) {
            var _this = $(this),
              isRequired = _this.attr("required"),
              isRadio = _this.is(":radio");
            
            //
            if (isRequired) {
              Validate.required(_this);
            }
            //radio
            if (isRadio) {
              Validate.required(parent);
            }
            Validate.setState();
             // end to removeClass
            parent = _this.parent();
           parent.removeClass("focus");
          }

         
        });
        // echeck event
        esubmit.on("click.Validate", function(e) {
         var _this=$(this);
         if(_this.hasClass("disabled")){
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

//ajaxform
jQuery.fn.ajaxsubmit = function(options) {
  var defaults = {};
  var options = $.extend(defaults, options);
  // options fn 
  this.each(function() {
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

jQuery(function() {
  $("[data-event='validate']").sValidate();
  esubmit = $(":submit");
  esubmit.on("click", function(e) {
    var form = $(this).parents("form");
    var isok = form.data("state");
    if (isok) {
      form.ajaxsubmit();
      e.preventDefault();
    }
  })
});