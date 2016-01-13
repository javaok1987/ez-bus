'use strict';

(function($) {

  var $slider = $('#slider'),
    $walkSlider = $('#walk-slider'),
    $select = {
      fromtime: $('#select-form-time'),
    },
    $conveyance = $('#article-conveyance'),
    $wrapper = $('#wrapper'),
    $footer = $('#footer');


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
      console.log($this.prop('checked'));
      console.log($this.prop('id'));
    });

    // Closes the sidebar menu
    $('#menu-close').click(function(e) {
      e.preventDefault();
      $('#sidebar-wrapper').toggleClass('active');
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
