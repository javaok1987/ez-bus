/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function(window, $) {

  'use strict';

  var Urls = {
    domain: 'http://207.46.231.69/TripTaipei'
  };

  Urls.getStops = Urls.domain + '/stops/getStops/#{lng}/#{lat}/#{distance}/#{type}';
  Urls.getTripArea = Urls.domain + '/getTripArea/GeoJson';

  var TripTaipeiService = {};

  TripTaipeiService.getStops = function(latitude, longitude, walkDistance, stopsType, callback) {

    $.ajax({
      url: Urls.getStops.replace('#{lng}', longitude).replace('#{lat}', latitude).replace('#{distance}', walkDistance).replace('#{type}', stopsType),
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(response) {
        console.log(response);
        (callback && typeof(callback) === "function") && callback(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  };

  TripTaipeiService.getTripArea = function(latitude, longitude, walkDistance, tripTime, weekType, startTime, transitType, callback) {

    $.ajax({
      url: Urls.getTripArea,
      jsonp: 'callback',
      type: 'POST',
      dataType: 'jsonp',
      data: {
        lat: latitude,
        lng: longitude,
        walkDistance: walkDistance,
        tripTime: tripTime,
        weekType: weekType,
        startTime: startTime,
        transitType: transitType

      },
      success: function(response) {
        console.log(response);
        (callback && typeof(callback) === "function") && callback(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
  };



  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(TripTaipeiService);
  } else {
    // browser global
    window.TripTaipeiService = TripTaipeiService;
  }

})(window, jQuery);
