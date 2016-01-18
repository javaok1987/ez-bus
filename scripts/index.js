'use strict';

(function($) {

  var $slider = $('#slider'),
    $walkSlider = $('#walk-slider'),
    $selectTime = $('#select-form-time');

  var $conveyance = $('#article-conveyance'),
    $wrapper = $('#wrapper'),
    $footer = $('#footer');

  var state = {
    walkDistance: 600,
    tripTime: 30,
    startTime: '0800',
    weekType: 1,
    transitType: 'BYTM',
    result: {
      area: '0',
      level: 'A'
    }
  };


  $(function($) {

    window.alert = swal;

    $('.iui-overlay').find('.btn-close').on('click', function() {

      classie.addClass(document.getElementById('overlay'), 'hidden');

      GMap.initialize(function() {

        $(window).resize(function(argument) {
          google.maps.event.trigger(GMap.map, 'resize');
        });

        google.maps.event.addListener(GMap.map, 'idle', function() {
          state.latitude = GMap.centerMarker.getPosition().lat();
          state.longitude = GMap.centerMarker.getPosition().lng();
          TripTaipeiService.query(state, setQueryResult);
        });

        var weekly = $('#weekly').find('.btn').on('click', function() {
          state.weekType = $(this).data('index');
          TripTaipeiService.query(state, setQueryResult);
        });
        state.weekType = new Date().getDay();
        $(weekly[state.weekType - 1]).addClass('active'); //判斷星期別.

        $conveyance.find('[data-toggle="checkbox"]').on('change.radiocheck', function(ele) {
          state.transitType = '';
          if ($('#bus').prop('checked')) {
            state.transitType += 'B';
          }
          if ($('#mrt').prop('checked')) {
            state.transitType += 'M';
          }
          if ($('#train').prop('checked')) {
            state.transitType += 'T';
          }
          if ($('#youbike').prop('checked')) {
            state.transitType += 'Y';
          }
          TripTaipeiService.query(state, setQueryResult);
        });

        $walkSlider.on('slidestop', function(event, ui) {
          state.walkDistance = $walkSlider.find('.ui-slider-value:last').data('slidervalue');
          GMap.centerCircle.setOptions({
            radius: state.walkDistance
          });
          TripTaipeiService.query(state, setQueryResult);
        });

        $slider.on('slidestop', function(event, ui) {
          state.tripTime = $slider.find('.ui-slider-value:last').data('slidervalue');
          TripTaipeiService.query(state, setQueryResult);
        });

        $selectTime.on('change', function(e) {
          state.startTime = e.val;
          TripTaipeiService.query(state, setQueryResult);
        });

      });

    });

    $('[data-toggle="switch"]').on('switchChange.bootstrapSwitch', function(event, state) {
      var $switch = $(event.target);
      GMap.checkStop($switch.prop('value'), state);
      GMap.level[$switch.val()] = state;
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

    // $('.iui-overlay').find('.btn-close').click(); //test code;

  });

  var setQueryResult = function(state) {
    $('#service-area').text(state.result.area);
    $('#service-level').text(state.result.level);
  };

})(jQuery);
