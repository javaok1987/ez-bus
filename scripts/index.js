'use strict';

(function($) {

  var $slider = $('#slider');
  var $walkSlider = $('#walk-slider');
  var $select = {
    fromtime: $('#select-form-time')
  };
  var $conveyance = $('#article-conveyance');
  var $wrapper = $('#wrapper');
  var $footer = $('#footer');


  jQuery(function($) {

    window.alert = swal;

    $('.iui-overlay').find('.btn-close').on('click', function() {
      classie.addClass(document.getElementById('overlay'), 'hidden');
      GMap.initMap(function() {
        $(window).resize(function(argument) {
          google.maps.event.trigger(GMap.map, 'resize');
          resizeSidebarPanel();
        });
      });

    });

    var weekly = $('#weekly').find('.btn').on('click', function() {
      console.log($(this).text());
    });
    $(weekly[new Date().getDay()]).click(); //判斷星期別.

    $conveyance.find('[data-toggle="checkbox"]').on('change.radiocheck', function(ele) {
      var $this = $(this);
      console.log($this.prop('id'), $this.prop('checked'));
    });

    // Closes the sidebar menu
    $('#menu-close').click(function(e) {
      e.preventDefault();
      $('#sidebar-wrapper').toggleClass('active');
      var _content = '搭乘時間: ' + $slider.find('.ui-slider-value:last').data('slidervalue');
      _content += '\n開始時間: ' + $select.fromtime.val();

      console.log(_content);
    });

    // Opens the sidebar menu
    $('#menu-toggle').click(function(e) {
      e.preventDefault();
      $('#sidebar-wrapper').toggleClass('active');
    });

    resizeSidebarPanel();

    // $('.iui-overlay').find('.btn-close').click(); //test code;

  });

  var resizeSidebarPanel = function(argument) {
    $('.sidebar-panel').height($(window).height() - 320);
  };

})(jQuery);
