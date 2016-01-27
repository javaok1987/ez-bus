if (window.MYAPP === undefined) {
  window.MYAPP = {};
}

MYAPP.FlatUI = function (flatUI) {

  "use strict";

  this.$panel = $(flatUI);
  var $panel = this.$panel,
    $tripTimeSlider = $panel.find("#slider-trip-time"),
    $walkSlider = $panel.find("#slider-walk"),
    sliderValueMultiplier = 15,
    sliderWalkValueMultiplier = 100;

  this.$tripTimeSlider = $tripTimeSlider;
  this.$walkSlider = $walkSlider;

  function init() {

    // Extend JS String with repeat method.∫
    String.prototype.repeat = function (num) {
      return new [].constructor(Math.round(num) + 1).join(this);
    };

    // Add segments to a slider.
    $.fn.addSliderSegments = function () {
      return this.each(function () {
        var $this = $(this),
          option = $this.slider("option"),
          amount = (option.max - option.min) / option.step,
          orientation = option.orientation,
          output = "",
          i,
          size,
          segmentGap,
          segment;
        if ("vertical" === orientation) {
          for (i = 0, size = amount - 1; i < size; i+=1) {
            output += '<div class="ui-slider-segment" style="top:' + 100 / amount * i + '%;"></div>';
          }
          $this.prepend(output);
        } else {
          segmentGap = 100 / amount + "%";
          segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
          $this.prepend(segment.repeat(amount - 1));
        }
      });
    };


    // Disable link clicks to prevent page scrolling
    $(document).on("click", 'a[href="#fakelink"]', function (e) {
      e.preventDefault();
    });

    // jQuery UI Sliders
    if ($tripTimeSlider.length > 0) {
      $tripTimeSlider.slider({
        min: 1,
        max: 4,
        value: 2,
        orientation: "horizontal",
        range: "min",
        slide: function (event, ui) {
          var value = ui.value * sliderValueMultiplier;
          $tripTimeSlider.find(".ui-slider-value:last").text(value + " 分鐘").data("slidervalue", value);
        }
      }).addSliderSegments($tripTimeSlider.slider("option").max);
    }

    $(".btn-group").on("click", "a", function () {
      $(this).siblings().removeClass("active").end().addClass("active");
    });

    if ($walkSlider.length > 0) {
      $walkSlider.slider({
        min: 2,
        max: 9,
        value: 6,
        orientation: "horizontal",
        range: "min",
        slide: function (event, ui) {
          var value = ui.value * sliderWalkValueMultiplier;
          $walkSlider.find(".ui-slider-value:last").text(value + " 公尺").data("slidervalue", value);
        }
      }).addSliderSegments($walkSlider.slider("option").max);
    }

    // Custom Selects
    if ($('[data-toggle="select"]').length) {
      $('[data-toggle="select"]').select2({
        minimumResultsForSearch: -1
      });
    }

    // Checkboxes and Radio buttons
    if ($('[data-toggle="checkbox"]').length) {
      $('[data-toggle="checkbox"]').radiocheck();
    }
    if ($('[data-toggle="radio"]').length) {
      $('[data-toggle="radio"]').radiocheck();
    }

    // Switches
    if ($('[data-toggle="switch"]').length) {
      $('[data-toggle="switch"]').bootstrapSwitch();
    }

  }

  init();
};
