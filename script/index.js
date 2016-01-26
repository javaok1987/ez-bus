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
          query();
        });

        var weekly = $('#weekly').find('.btn').on('click', function() {
          state.weekType = $(this).data('index');
          query();
        });
        state.weekType = new Date().getDay();
        $(weekly[state.weekType - 1]).addClass('active'); //設定星期別.

        $walkSlider.on('slidestop', function(event, ui) {
          state.walkDistance = $walkSlider.find('.ui-slider-value:last').data('slidervalue');
          GMap.centerCircle.setOptions({
            radius: state.walkDistance
          });
          query();
        });

        $slider.on('slidestop', function(event, ui) {
          state.tripTime = $slider.find('.ui-slider-value:last').data('slidervalue');
          query();
        });

      });

    });

    $wrapper.find('#article-conveyance [data-toggle="switch"]').on('switchChange.bootstrapSwitch', function(event, checked) {
      var $switch = $(event.target);
      var _transitType = state.transitType;
      if (checked && _transitType.indexOf($switch.val()) === -1) {
        _transitType += $switch.val();
      } else {
        _transitType = _transitType.replace($switch.val(), '');
      }
      state.transitType = _transitType;
      query();
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
      query();
    });

    // $('.iui-overlay').find('button').click(); //test code;
    // $('#menu-toggle').click(); //test code;

  });

  function setQueryResult() {
    $('#service-area').text(state.result.area);
    $('#service-level').text(state.result.level);
  }

  function pauseVideo() {
    var vid = document.getElementById('bgvid');
    vid.pause();
    vid.addEventListener('ended', function() {
      // only functional if "loop" is removed
      vid.pause();
      // to capture IE10
      vid.classList.add('stopfade');
    });
  }

  function query() {
    if (state.transitType.length > 0) {
      TripTaipeiService.query(state, setQueryResult);
    } else {
      window.alert('請至少選擇一種交通工具');
      GMap.clearMap();
    }
  }

})(jQuery);
