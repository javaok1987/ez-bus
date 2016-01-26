/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function(window, $) {

  'use strict';

  var Urls = {
    domain: 'http://demo.datarget.com.tw/TripTaipei'
  };

  Urls.getStops = Urls.domain + '/stops/getStops/#{lng}/#{lat}/#{distance}/#{type}';
  Urls.getTripArea = Urls.domain + '/getTripArea/GeoJson';

  var TripTaipeiService = {};

  function showErrorMessage(argument) {
    if (swal) {
      swal({
        title: 'Oops!',
        text: '設定條件內無大眾運輸資料.',
      });
    } else {
      window.alert('設定條件內無大眾運輸資料.');
    }
  }

  TripTaipeiService.getStops = function(state, callback) {
    return $.ajax({
      // url:'../data/stops.json',
      // dataType: 'json',
      url: Urls.getStops.replace('#{lng}', state.longitude).replace('#{lat}', state.latitude).replace('#{distance}', state.walkDistance).replace('#{type}', state.transitType),
      jsonp: 'callback',
      dataType: 'jsonp',
      success: function(response) {
        if (response.result === '0') {
          showErrorMessage();
        }
        (callback && typeof(callback) === "function") && callback(response, state.transitType);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  TripTaipeiService.getTripArea = function(state, callback) {
    return $.ajax({
      // url:'../data/tripArea.json',
      // dataType: 'json',
      url: Urls.getTripArea,
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
        lat: state.latitude,
        lng: state.longitude,
        walkDistance: state.walkDistance,
        tripTime: state.tripTime,
        weekType: state.weekType,
        startTime: state.startTime,
        transitType: state.transitType
      },
      beforeSend: function(xhr) {
        classie.removeClass(document.getElementById('pageBlock'), 'hidden');
      },
      complete: function() {
        classie.addClass(document.getElementById('pageBlock'), 'hidden');
      },
      success: function(response) {
        if (jQuery.isEmptyObject(response)) {
          state.result.area = '0';
          state.result.level = 'A';
          return false;
        }
        state.result.area = response.result.BUSAREA;
        state.result.level = response.result.BUSSERVICE;
        (callback && typeof(callback) === "function") && callback(response);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  TripTaipeiService.query = function(state, callback) {
    console.log(state);
    var stopsAjax = this.getStops(state, GMap.addStops);
    var tripAreaAjax = this.getTripArea(state, GMap.addGeoJson);
    $.when.apply($, [stopsAjax, tripAreaAjax]).then(function() {
      (callback && typeof(callback) === "function") && callback();
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
