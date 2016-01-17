'use strict';

(function($) {

  var $slider = $('#slider'),
    $walkSlider = $('#walk-slider'),
    $select = {
      fromtime: $('#select-form-time')
    };

  var $conveyance = $('#article-conveyance'),
    $wrapper = $('#wrapper'),
    $footer = $('#footer');

  var walkingDistance = 600,
    tripTime = 30;


  $(function($) {

    window.alert = swal;

    $('.iui-overlay').find('.btn-close').on('click', function() {

      classie.addClass(document.getElementById('overlay'), 'hidden');

      GMap.initialize(function() {

        $(window).resize(function(argument) {
          google.maps.event.trigger(GMap.map, 'resize');
        });

        google.maps.event.addListener(GMap.map, 'idle', function() {
          GMap.centerMarker.setPosition(GMap.map.getCenter());
          GMap.centerCircle.setCenter(GMap.centerMarker.getPosition());
        });
        google.maps.event.addListener(GMap.infowindow, 'dragstart', function(event) {
          GMap.infowindow.close();
        });

        google.maps.event.addListener(GMap.centerMarker, 'drag', function(event) {
          GMap.centerCircle.setCenter(GMap.centerMarker.getPosition());
        });

        google.maps.event.addListener(GMap.map, 'idle', function() {
          TripTaipeiService.getStops(GMap.map.getCenter().lat(), GMap.map.getCenter().lng(), walkingDistance, 'BYTM', GMap.addStops);
          TripTaipeiService.getTripArea(GMap.map.getCenter().lat(), GMap.map.getCenter().lng(), walkingDistance, tripTime, 1, '0800', 'YMBT', GMap.addGeoJson);
        });

        google.maps.event.addListener(GMap.centerMarker, 'dragend', function(event) {
          TripTaipeiService.getStops(GMap.centerMarker.getPosition().lat(), GMap.centerMarker.getPosition().lng(), walkingDistance, 'BYTM', GMap.addStops);
          TripTaipeiService.getTripArea(GMap.centerMarker.getPosition().lat(), GMap.centerMarker.getPosition().lng(), walkingDistance, tripTime, 1, '0800', 'YMBT', GMap.addGeoJson);
        });

        google.maps.event.addListener(GMap.centerCircle, 'radius_changed', function() {
          TripTaipeiService.getStops(GMap.centerMarker.getPosition().lat(), GMap.centerMarker.getPosition().lng(), walkingDistance, 'BYTM', GMap.addStops);
          TripTaipeiService.getTripArea(GMap.centerMarker.getPosition().lat(), GMap.centerMarker.getPosition().lng(), walkingDistance, tripTime, 1, '0800', 'YMBT', GMap.addGeoJson);
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


    $walkSlider.on('slidestop', function(event, ui) {
      walkingDistance = $walkSlider.find('.ui-slider-value:last').data('slidervalue');
      GMap.centerCircle.setOptions({
        radius: walkingDistance
      });
    });

    $slider.on('slidestop', function(event, ui) {
      tripTime = $slider.find('.ui-slider-value:last').data('slidervalue');
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

    $('.iui-overlay').find('.btn-close').click(); //test code;

  });


})(jQuery);
