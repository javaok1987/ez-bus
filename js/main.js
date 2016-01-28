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

if (window.MYAPP === undefined) {
  window.MYAPP = {};
}

MYAPP.alert = function (title, text) {
  "use strict";
  if (typeof swal === "function") {
    swal({
      title: title,
      text: (text === undefined) ? "" : text
    });
  } else {
    window.alert(title);
  }
};

(function ($) {

  "use strict";

  var $app = $("#wrapper"),
    state = {
      walkDistance: 600,
      tripTime: 30,
      startTime: "0800",
      weekType: 1,
      transitType: "BYTM"
    };

  function pauseVideo() {
    var vid = document.getElementById("bgvid");
    vid.pause();
    vid.addEventListener("ended", function () {
      // only functional if "loop" is removed
      vid.pause();
      // to capture IE10
      vid.classList.add("stopfade");
    });
  }

  function query() {
    console.log(state);
    if (state.transitType.length > 0) {
      TripTaipeiService.query(state, function () {
        $app.find("#pageBlock").removeClass("hidden");
      }, function () {
        $app.find("#pageBlock").addClass("hidden");
      }, function (area, service) {
        $app.find("#bus-area").text(area || "0");
        $app.find("#bus-service").text(service || "A");
      });
    } else {
      MYAPP.alert("請至少選擇一種交通工具");
      GMap.clearMap();
    }
  }

  // debounce event function
  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this,
        args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  $(function ($) {

    $app.removeClass("hidden");
    FastClick.attach(document.body);

    var FlatUI = new MYAPP.FlatUI('#sidebar-wrapper');

    $(".iui-overlay").find("button").on("click", debounce(function () {

      pauseVideo();

      GMap.initialize(function () {
        console.log('map init...');
        $(window).resize(function () {
          google.maps.event.trigger(GMap.map, "resize");
        });

        google.maps.event.addListenerOnce(GMap.map, "idle", function () {
          state.latitude = GMap.centerMarker.getPosition().lat();
          state.longitude = GMap.centerMarker.getPosition().lng();
        });

        google.maps.event.addListenerOnce(GMap.map, "idle", function () {
          $app.find("#overlay").slideUp("slow");
          $app.find("#businfo-panal").removeClass("hidden");
          $app.find("#menu-toggle").removeClass("hidden");
        });

        google.maps.event.addListener(GMap.centerMarker, "dragend", function () {
          state.latitude = GMap.centerMarker.getPosition().lat();
          state.longitude = GMap.centerMarker.getPosition().lng();
          query();
        });

      });

    }, 10));

    var weekly = FlatUI.$panel.find("#weekly .btn").on("click", function () {
      state.weekType = $(this).data("index");
      query();
    });
    state.weekType = new Date().getDay();
    $(weekly[state.weekType - 1]).addClass("active"); //設定星期別.

    FlatUI.$panel.find("#slider-walk").on("slidestop", function () {
      state.walkDistance = $(this).find(".ui-slider-value:last").data("slidervalue");
      GMap.centerCircle.setOptions({
        radius: state.walkDistance
      });
      query();
    });

    FlatUI.$panel.find("#slider-trip-time").on("slidestop", function () {
      state.tripTime = $(this).find(".ui-slider-value:last").data("slidervalue");
      query();
    });

    FlatUI.$panel.find('#article-conveyance [data-toggle="switch"]').on("switchChange.bootstrapSwitch", function (event, checked) {
      var $switch = $(event.target),
        transitType = state.transitType;
      if (checked && transitType.indexOf($switch.val()) === -1) {
        transitType += $switch.val();
      } else {
        transitType = transitType.replace($switch.val(), "");
      }
      state.transitType = transitType;
      query();
    });

    FlatUI.$panel.find("#timepicker").timepicker({
      defaultTime: "08:00 AM",
      disableFocus: false,
      showMeridian: false
    }).on("hide.timepicker", function (e) {
      var selectTime = e.time.value;
      if (e.time.hours < 10) {
        selectTime = "0" + selectTime;
      }
      state.startTime = selectTime.replace(":", "");
      query();
    });

    // Toggle the sidebar menu
    $app.find("#menu-toggle, #menu-close").click(function (e) {
      e.preventDefault();
      $app.find("#sidebar-wrapper").toggleClass("active");
    });

    // $app.find(".iui-overlay").find("button").click(); //test code;
    // $app.find("#menu-toggle").click(); //test code;

  });



}(jQuery));

/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function () {
  'use strict';

  var stopsAry = [],
    busLayer = new google.maps.Data(),
    mrtLayer = new google.maps.Data(),
    traLayer = new google.maps.Data(),
    ubikeLayer = new google.maps.Data(),
    GMap = {
      map: {},
      centerMarker: {},
      centerCircle: {},
      infowindow: {}
    };

  /**
   * 客製化按鈕.
   * @param {[type]} controlDiv [description]
   * @param {[type]} map        [description]
   */
  function CenterControl(controlDiv, title, callback) {

    // Set CSS for the control border.
    this.controlUI = document.createElement('div');
    this.controlUI.style.backgroundColor = '#fff';
    this.controlUI.style.border = '2px solid #fff';
    this.controlUI.style.borderRadius = '3px';
    this.controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    this.controlUI.style.cursor = 'pointer';
    this.controlUI.style.marginLeft = '10px';
    this.controlUI.style.textAlign = 'center';
    this.controlUI.title = title;

    // Set CSS for the control interior.
    this.controlText = document.createElement('div');
    this.controlText.style.color = 'rgb(25,25,25)';
    this.controlText.style.fontSize = '14px';
    this.controlText.style.lineHeight = '22px';
    this.controlText.style.paddingLeft = '5px';
    this.controlText.style.paddingRight = '5px';
    this.controlText.innerHTML = '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>';
    this.controlUI.appendChild(this.controlText);

    controlDiv.appendChild(this.controlUI);

    // Setup the click event listeners.
    (callback && typeof (callback) === 'function') && this.controlUI.addEventListener('click', callback);
  }

  GMap.initialize = function (callback) {
    var latlng = new google.maps.LatLng(25.046281027241395, 121.51760685634758),
      mapOptions = {
        zoom: 13,
        disableDefaultUI: true,
        scrollwheel: false,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        // center: new google.maps.LatLng() //全台23.714059, 120.832002
        styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"administrative","elementType":"labels","stylers":[{"saturation":"-100"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"gamma":"0.75"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-37"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"saturation":"-100"},{"lightness":"-37"}]},{"featureType":"landscape.natural","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"100"},{"weight":"2"}]},{"featureType":"landscape.natural","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"80"}]},{"featureType":"poi","elementType":"labels","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"lightness":"-4"},{"saturation":"-100"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"on"},{"saturation":"-95"},{"lightness":"62"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road","elementType":"labels","stylers":[{"saturation":"-100"},{"gamma":"1.00"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"gamma":"0.50"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"gamma":"0.50"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"-13"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"lightness":"0"},{"gamma":"1.09"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"saturation":"-100"},{"lightness":"47"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"-12"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"},{"lightness":"77"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-5"},{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-15"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"lightness":"47"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"53"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-42"},{"saturation":"17"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":"61"}]}]
      },
      centerControl = {};

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // getCurrentLocation(); //定位.

    this.centerMarker = new google.maps.Marker({
      draggable: true,
      position: latlng,
      map: this.map,
      icon: 'data:image/png;base64,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'
    });

    this.infowindow = new google.maps.InfoWindow({
      content: '<p>拖曳我<span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span></p>'
    });
    this.infowindow.open(this.map, this.centerMarker);
    centerControl.div = document.createElement('div');
    centerControl.ui = new CenterControl(centerControl.div, '移動到臺北車站', function () {
      this.centerMarker.setPosition(latlng);
      this.centerCircle.setCenter(latlng);
      this.map.panTo(latlng);
    }.bind(this));

    centerControl.div.index = 1;
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(centerControl.div);

    this.centerCircle = new google.maps.Circle({
      strokeColor: '#2980B9',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3498DB',
      fillOpacity: 0.1,
      map: this.map,
      center: latlng,
      radius: 600,
      zIndex: 999
    });

    // google.maps.event.addListener(this.centerMarker, 'dragend', function(event) {
    //   locationAddress(this.centerMarker.getPosition().lat(), this.centerMarker.getPosition().lng());
    // });

    // google.maps.event.addListener(this.map, 'idle', function() {
    //   this.centerMarker.setPosition(this.map.getCenter());
    //   this.centerCircle.setCenter(this.centerMarker.getPosition());
    // });

    google.maps.event.addListener(this.centerMarker, 'dragstart', function () {
      this.infowindow.close();
    }.bind(this));

    google.maps.event.addListener(this.centerMarker, 'drag', function () {
      this.centerCircle.setCenter(this.centerMarker.getPosition());
    }.bind(this));

    (callback && typeof (callback) === 'function') && callback();
  };

  /**
   * 定位現在位置.
   * @param  {[type]} latitude  [description]
   * @param  {[type]} longitude [description]
   * @return {[type]}           [description]
   */
  function locationAddress(latitude, longitude) {
    GMap.map.setCenter(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
    GMap.map.setZoom(14);
    // console.log('定位完成！');
  }

  /**
   * 定位成功.
   * @param  {[type]} pos [description]
   * @return {[type]}     [description]
   */
  function successCallback(pos) {
    locationAddress(pos.coords.latitude, pos.coords.longitude);
  }

  /**
   * 定位失敗.
   * @param  {[type]} error [description]
   * @return {[type]}       [description]
   */
  function errorCallback(error) {
    switch (error.code) {
    case 1:
      console.error('錯誤!應用程式沒有權限使用定位服務!');
      break;
    case 2:
      console.error('錯誤!取得位址資料時發生錯誤!');
      break;
    case 3:
      console.error('錯誤!超過等待時間...');
      break;
    default:
      console.error('不明錯誤...');
      break;
    }
  }

  /**
   * 取得現在位置.
   * @return {[type]} [description]
   */
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error('錯誤!不支援定位服務!');
    }
  }

  function setMarkerInfoWindow(marker, stopName) {
    marker.addListener('click', function () {
      this.infowindow.setOptions({
        content: '<p>' + stopName + '</p>'
      });
      this.infowindow.open(this.map, marker);
    }.bind(GMap));
  }

  GMap.clearMap = function (type) {

    function cleanStops() {
      var i;
      if (stopsAry) {
        for (i = stopsAry.length - 1; i >= 0; i -= 1) {
          stopsAry[i].setMap(null);
        }
        stopsAry.length = 0;
      }
    }

    function cleanGeoJson() {
      busLayer.forEach(function (feature) {
        busLayer.remove(feature);
      });

      traLayer.forEach(function (feature) {
        traLayer.remove(feature);
      });

      mrtLayer.forEach(function (feature) {
        mrtLayer.remove(feature);
      });

      ubikeLayer.forEach(function (feature) {
        ubikeLayer.remove(feature);
      });
    }

    switch (type) {
    case 'Stop':
      cleanStops();
      break;
    case 'GeoJson':
      cleanGeoJson();
      break;
    default:
      cleanStops();
      cleanGeoJson();
    }

  };

  GMap.addStops = function (data, stopType) {
    this.clearMap('Stop');
    if (data.result.length > 0) {
      var i,
        fillColor,
        title,
        type,
        marker;
      for (i = data.result.length - 1; i >= 0; i -= 1) {
        type = data.result[i].type;
        if (stopType.indexOf(type) > -1) {
          switch (type) {
          case 'M':
            fillColor = '#2980b9';
            title = '捷運站: ';
            break;
          case 'B':
            fillColor = '#16a085';
            title = '客運站: ';
            break;
          case 'T':
            fillColor = '#c0392b';
            title = '火車站: ';
            break;
          case 'Y':
            fillColor = '#f39c12';
            title = 'YouBike: ';
            break;
          }

          marker = new google.maps.Marker({
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: fillColor,
              fillOpacity: 1,
              scale: 4.5,
              strokeColor: 'white',
              strokeWeight: 0.5
            },
            map: this.map,
            type: type,
            position: {
              lat: parseFloat(data.result[i].lat),
              lng: parseFloat(data.result[i].lng)
            }
          });

          stopsAry.push(marker);
          setMarkerInfoWindow(marker, title + data.result[i].name);
        }
      }
    }
  }.bind(GMap);

  GMap.addGeoJson = function (data) {
    this.clearMap('GeoJson');
    if (!jQuery.isEmptyObject(data)) {
      mrtLayer.setStyle({
        fillColor: '#2980b9',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 991
      });

      busLayer.setStyle({
        fillColor: '#16a085',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 995
      });

      traLayer.setStyle({
        fillColor: '#c0392b',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 997
      });

      ubikeLayer.setStyle({
        fillColor: '#f39c12',
        fillOpacity: 0.6,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 1.2,
        zIndex: 996
      });

      if (data.result.B) {
        busLayer.addGeoJson(jQuery.parseJSON(data.result.B));
      }
      if (data.result.M) {
        mrtLayer.addGeoJson(jQuery.parseJSON(data.result.M));
      }
      if (data.result.T) {
        traLayer.addGeoJson(jQuery.parseJSON(data.result.T));
      }
      if (data.result.Y) {
        ubikeLayer.addGeoJson(jQuery.parseJSON(data.result.Y));
      }

      busLayer.setMap(this.map);
      mrtLayer.setMap(this.map);
      traLayer.setMap(this.map);
      ubikeLayer.setMap(this.map);
    }
  }.bind(GMap);

  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(GMap);
  } else {
    // browser global
    window.GMap = GMap;
  }

}());

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
