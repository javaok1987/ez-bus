'use strict';

(function($) {

  var $slider = $('#slider'),
    $walkSlider = $('#walk-slider');

  var $conveyance = $('#article-conveyance'),
    $wrapper = $('#wrapper');

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

    classie.removeClass(document.getElementById('wrapper'), 'hidden');
    FastClick.attach(document.body);

    window.alert = swal;

    $('.iui-overlay').find('button').on('click', function() {

      pauseVideo();

      GMap.initialize(function() {

        $(window).resize(function(argument) {
          google.maps.event.trigger(GMap.map, 'resize');
        });

        google.maps.event.addListenerOnce(GMap.map, 'idle', function() {
          state.latitude = GMap.centerMarker.getPosition().lat();
          state.longitude = GMap.centerMarker.getPosition().lng();
        });

        google.maps.event.addListenerOnce(GMap.map, 'idle', function() {
          $('#overlay').slideUp('slow');
          classie.removeClass(document.getElementById('businfo-panal'), 'hidden');
          classie.removeClass(document.getElementById('menu-toggle'), 'hidden');
        });

        google.maps.event.addListener(GMap.centerMarker, 'dragend', function(event) {
          state.latitude = GMap.centerMarker.getPosition().lat();
          state.longitude = GMap.centerMarker.getPosition().lng();
          TripTaipeiService.query(state, setQueryResult);
        });

        var weekly = $('#weekly').find('.btn').on('click', function() {
          state.weekType = $(this).data('index');
          TripTaipeiService.query(state, setQueryResult);
        });
        state.weekType = new Date().getDay();
        $(weekly[state.weekType - 1]).addClass('active'); //設定星期別.

        $wrapper.find('#article-conveyance>[data-toggle="checkbox"]').on('change.radiocheck', function(ele) {
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

    $('#timepicker').timepicker({
      defaultTime: '08:00 AM',
      disableFocus: false,
      showMeridian: false
    }).on('hide.timepicker', function(e) {
      var _selectTime = e.time.value;
      if (e.time.hours < 10) {
        _selectTime = '0' + _selectTime;
      }
      state.startTime = _selectTime.replace(':', '');
      TripTaipeiService.query(state, setQueryResult);
    });

    // $('.iui-overlay').find('button').click(); //test code;
    // $('#menu-toggle').click(); //test code;

  });

  var setQueryResult = function(state) {
    $('#service-area').text(state.result.area);
    $('#service-level').text(state.result.level);
  };

  var pauseVideo = function() {
    var vid = document.getElementById('bgvid');
    vid.pause();
    vid.addEventListener('ended', function() {
      // only functional if "loop" is removed
      vid.pause();
      // to capture IE10
      vid.classList.add('stopfade');
    });
  };

})(jQuery);
