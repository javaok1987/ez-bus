/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function() {

  'use strict';
  var stopsAry = [];

  var busLayer = new google.maps.Data();
  var mrtLayer = new google.maps.Data();
  var traLayer = new google.maps.Data();

  var GMap = {
    map: {},
    centerMarker:{},
    centerCircle:{},
    infowindow :{}
  };

  GMap.initialize = function(callback) {
    var self = this;
    var mapOptions = {
      zoom: 13,
      disableDefaultUI: true,
      scrollwheel: false,
      center: new google.maps.LatLng(25.047750, 121.517371),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      // center: new google.maps.LatLng() //全台23.714059, 120.832002
      // styles: [{'featureType':'administrative','elementType':'all','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'administrative','elementType':'labels','stylers':[{'saturation':'-100'}]},{'featureType':'administrative','elementType':'labels.text','stylers':[{'gamma':'0.75'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'lightness':'-37'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#f9f9f9'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'40'},{'visibility':'off'}]},{'featureType':'landscape.natural','elementType':'labels.text.fill','stylers':[{'saturation':'-100'},{'lightness':'-37'}]},{'featureType':'landscape.natural','elementType':'labels.text.stroke','stylers':[{'saturation':'-100'},{'lightness':'100'},{'weight':'2'}]},{'featureType':'landscape.natural','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'80'}]},{'featureType':'poi','elementType':'labels','stylers':[{'saturation':'-100'},{'lightness':'0'}]},{'featureType':'poi.attraction','elementType':'geometry','stylers':[{'lightness':'-4'},{'saturation':'-100'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'},{'visibility':'on'},{'saturation':'-95'},{'lightness':'62'}]},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{'featureType':'road','elementType':'all','stylers':[{'lightness':20}]},{'featureType':'road','elementType':'labels','stylers':[{'saturation':'-100'},{'gamma':'1.00'}]},{'featureType':'road','elementType':'labels.text','stylers':[{'gamma':'0.50'}]},{'featureType':'road','elementType':'labels.icon','stylers':[{'saturation':'-100'},{'gamma':'0.50'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'},{'saturation':'-100'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'lightness':'-13'}]},{'featureType':'road.highway','elementType':'labels.icon','stylers':[{'lightness':'0'},{'gamma':'1.09'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'},{'saturation':'-100'},{'lightness':'47'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'lightness':'-12'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'},{'lightness':'77'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'lightness':'-5'},{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'saturation':'-100'},{'lightness':'-15'}]},{'featureType':'transit.station.airport','elementType':'geometry','stylers':[{'lightness':'47'},{'saturation':'-100'}]},{'featureType':'water','elementType':'all','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'water','elementType':'geometry','stylers':[{'saturation':'53'}]},{'featureType':'water','elementType':'labels.text.fill','stylers':[{'lightness':'-42'},{'saturation':'17'}]},{'featureType':'water','elementType':'labels.text.stroke','stylers':[{'lightness':'61'}]}]
    };

    self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    getCurrentLocation();

    var image = 'data:image/png;base64,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';
    var myLatLng = new google.maps.LatLng(25.0372264, 121.506378);
    self.centerMarker = new google.maps.Marker({
      draggable: true,
      position: myLatLng,
      map: self.map,
      icon: image
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, self.map);

    centerControlDiv.index = 1;
    self.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    self.centerCircle = new google.maps.Circle({
      strokeColor: '#2980B9',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#3498DB',
      fillOpacity: 0.1,
      map: self.map,
      center: self.map.getCenter(),
      radius: 600,
      zIndex: 999
    });

    self.infowindow = new google.maps.InfoWindow({});

    (callback && typeof(callback) === "function") && callback();
  };

  /**
   * 定位現在位置.
   * @param {[type]} pos [description]
   */
  var locationAddress = function(pos) {
    var coords = new google.maps.LatLng(parseFloat(pos.coords.latitude), parseFloat(pos.coords.longitude));
    // var marker = new google.maps.Marker({
    //   position: coords,
    //   map: GMap.map
    // });
    GMap.map.setCenter(coords);
    // console.log('定位完成！');
  };

  /**
   * 定位成功.
   * @param  {[type]} pos [description]
   * @return {[type]}     [description]
   */
  var successCallback = function(pos) {
    locationAddress(pos);
  };

  /**
   * 定位失敗.
   * @param  {[type]} error [description]
   * @return {[type]}       [description]
   */
  var errorCallback = function(error) {
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
  };

  /**
   * 客製化按鈕.
   * @param {[type]} controlDiv [description]
   * @param {[type]} map        [description]
   */
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    this.controlUI = document.createElement('div');
    this.controlUI.style.backgroundColor = '#fff';
    this.controlUI.style.border = '2px solid #fff';
    this.controlUI.style.borderRadius = '3px';
    this.controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    this.controlUI.style.cursor = 'pointer';
    this.controlUI.style.marginTop = '15px';
    this.controlUI.style.textAlign = 'center';
    this.controlUI.title = '顯示您的位置';

    // Set CSS for the control interior.
    this.controlText = document.createElement('div');
    this.controlText.style.color = 'rgb(25,25,25)';
    this.controlText.style.fontSize = '14px';
    this.controlText.style.lineHeight = '22px';
    this.controlText.style.paddingLeft = '5px';
    this.controlText.style.paddingRight = '5px';
    this.controlText.innerHTML = '定位';
    this.controlUI.appendChild(this.controlText);

    controlDiv.appendChild(this.controlUI);

    // Setup the click event listeners.
    this.controlUI.addEventListener('click', function() {
      getCurrentLocation();
    });

  }

  /**
   * 取得現在位置.
   * @return {[type]} [description]
   */
  var getCurrentLocation = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error('錯誤!不支援定位服務!');
    }
  };

  var setMarkerInfoWindow = function(marker, stopName) {
    var self = marker;
    self.addListener('click', function() {
      infowindow.setOptions({
        content: stopName
      });
      infowindow.open(GMap.map, self);

    });
  };

  var clearMap = function(type) {
    switch (type) {
      case 'Stop':
        if (stopsAry) {
          for (var i = stopsAry.length - 1; i >= 0; i--) {
            stopsAry[i].setMap(null);
          }
          stopsAry.length = 0;
        }
        break;
      case 'GeoJson':
        busLayer.forEach(function(feature) {
          busLayer.remove(feature);
        });

        traLayer.forEach(function(feature) {
          traLayer.remove(feature);
        });

        mrtLayer.forEach(function(feature) {
          mrtLayer.remove(feature);
        });

        break;
    }
  };

  GMap.addStops = function(data) {
    clearMap('Stop');
    if (data.result.length > 0) {
      for (var i = data.result.length - 1; i >= 0; i--) {
        var fillColor = null;
        if (data.result[i].type === "B") {
          fillColor = '#f39c12';
        } else if (data.result[i].type === "M") {
          fillColor = '#16a085';
        } else if (data.result[i].type === "T") {
          fillColor = '#c0392b';
        }
        var marker = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: fillColor,
            fillOpacity: 1,
            scale: 4.5,
            strokeColor: 'white',
            strokeWeight: 0.5
          },
          map: GMap.map,
          position: {
            lat: parseFloat(data.result[i].lat),
            lng: parseFloat(data.result[i].lng),
          }
        });
        stopsAry.push(marker);
        setMarkerInfoWindow(marker, data.result[i].name);
      }
    } else {
      swal({
        title: "Oops!",
        text: "設定條件內無大眾運輸資料.",
      });

    }
  };

  GMap.addGeoJson = function(data) {
    clearMap('GeoJson');
    if (!jQuery.isEmptyObject(data)) {
      busLayer.setStyle({
        fillColor: '#f39c12',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 997
      });
      mrtLayer.setStyle({
        fillColor: '#16a085',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 996
      });
      traLayer.setStyle({
        fillColor: '#c0392b',
        fillOpacity: 0.5,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 0.5,
        zIndex: 998
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
      busLayer.setMap(GMap.map);
      mrtLayer.setMap(GMap.map);
      traLayer.setMap(GMap.map);
    } else {
      swal({
        title: "Oops!",
        text: "設定條件內無大眾運輸資料.",
      });
    }
  };

  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(GMap);
  } else {
    // browser global
    window.GMap = GMap;
  }

})();
