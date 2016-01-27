/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function (window, $) {

  "use strict";

  var Urls = {
      domain: "http://demo.datarget.com.tw/TripTaipei"
    },
    TripTaipeiService = {};

  Urls.getStops = Urls.domain + "/stops/getStops/#{lng}/#{lat}/#{distance}/#{type}";
  Urls.getTripArea = Urls.domain + "/getTripArea/GeoJson";

  function showErrorMessage() {
    if (typeof swal === "function") {
      swal({
        title: "Oops!",
        text: "設定條件內無大眾運輸資料."
      });
    } else {
      window.alert("設定條件內無大眾運輸資料.");
    }
  }

  TripTaipeiService.getStops = function (state, callback) {
    return $.ajax({
      // url:"../data/stops.json",
      // dataType: "json",
      url: Urls.getStops.replace("#{lng}", state.longitude).replace("#{lat}", state.latitude).replace("#{distance}", state.walkDistance).replace("#{type}", state.transitType),
      jsonp: "callback",
      dataType: "jsonp",
      success: function (response) {
        if (response.result === "0") {
          showErrorMessage();
        }
        (callback && typeof (callback) === "function") && callback(response, state.transitType);
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  TripTaipeiService.getTripArea = function (data, beforeSend, complete, callback) {
    return $.ajax({
      // url:"../data/tripArea.json",
      // dataType: "json",
      url: Urls.getTripArea,
      jsonp: "callback",
      dataType: "jsonp",
      data: {
        lat: data.latitude,
        lng: data.longitude,
        walkDistance: data.walkDistance,
        tripTime: data.tripTime,
        weekType: data.weekType,
        startTime: data.startTime,
        transitType: data.transitType
      },
      beforeSend: beforeSend,
      complete: complete,
      success: function (response) {
        (callback && typeof (callback) === "function") && callback(response);
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  TripTaipeiService.query = function (data, beforeSend, complete, callback) {
    var stopsAjax = this.getStops(data, GMap.addStops),
      tripAreaAjax = this.getTripArea(data, beforeSend, complete, GMap.addGeoJson);
    jQuery.when.apply($, [stopsAjax, tripAreaAjax]).then(function () {
      (callback && typeof (callback) === "function") && callback(tripAreaAjax.responseJSON.result.BUSAREA, tripAreaAjax.responseJSON.result.BUSSERVICE);
    });
  };

  // transport
  if (typeof define === "function" && define.amd) {
    // AMD
    define(TripTaipeiService);
  } else {
    // browser global
    window.TripTaipeiService = TripTaipeiService;
  }

}(window, jQuery));
