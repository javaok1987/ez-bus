/*jshint browser: true, strict: true, undef: true */
/*global define: false */
(function(window) {

  'use strict';

  /**
   * 定位現在位置.
   * @param {[type]} pos [description]
   */
  function LocationAddress(pos) {
    var coords = new google.maps.LatLng(parseFloat(pos.coords.latitude), parseFloat(pos.coords.longitude));
    // var marker = new google.maps.Marker({
    //   position: coords,
    //   map: GMap.map
    // });
    GMap.map.setCenter(coords);
    // window.alert('定位完成！');
  }


  /**
   * 定位成功.
   * @param  {[type]} pos [description]
   * @return {[type]}     [description]
   */
  function successCallback(pos) {
    var local = new LocationAddress(pos);
  }

  /**
   * 定位失敗.
   * @param  {[type]} error [description]
   * @return {[type]}       [description]
   */
  function errorCallback(error) {
    switch (error.code) {
      case 1:
        window.alert('錯誤!應用程式沒有權限使用定位服務!');
        break;
      case 2:
        window.alert('錯誤!取得位址資料時發生錯誤!');
        break;
      case 3:
        window.alert('錯誤!超過等待時間...');
        break;
      default:
        window.alert('不明錯誤...');
        break;
    }
  }

  /**
   * 取得現在位置.
   * @return {[type]} [description]
   */
  function currentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      window.alert('錯誤!不支援定位服務!');
    }
  }


  /**
   * 客製化按鈕.
   * @param {[type]} controlDiv [description]
   * @param {[type]} map        [description]
   */
  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '15px';
    controlUI.style.textAlign = 'center';
    controlUI.title = '顯示您的位置';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontSize = '14px';
    controlText.style.lineHeight = '22px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '定位';
    controlUI.appendChild(controlText);

    // Setup the click event listeners.
    controlUI.addEventListener('click', function() {
      currentLocation();
    });

  }

  function initMap(callback) {

    var mapOptions = {
      zoom: 12,
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
      styles: [{'featureType':'administrative','elementType':'all','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'administrative','elementType':'labels','stylers':[{'saturation':'-100'}]},{'featureType':'administrative','elementType':'labels.text','stylers':[{'gamma':'0.75'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'lightness':'-37'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#f9f9f9'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'40'},{'visibility':'off'}]},{'featureType':'landscape.natural','elementType':'labels.text.fill','stylers':[{'saturation':'-100'},{'lightness':'-37'}]},{'featureType':'landscape.natural','elementType':'labels.text.stroke','stylers':[{'saturation':'-100'},{'lightness':'100'},{'weight':'2'}]},{'featureType':'landscape.natural','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'saturation':'-100'},{'lightness':'80'}]},{'featureType':'poi','elementType':'labels','stylers':[{'saturation':'-100'},{'lightness':'0'}]},{'featureType':'poi.attraction','elementType':'geometry','stylers':[{'lightness':'-4'},{'saturation':'-100'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'},{'visibility':'on'},{'saturation':'-95'},{'lightness':'62'}]},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{'featureType':'road','elementType':'all','stylers':[{'lightness':20}]},{'featureType':'road','elementType':'labels','stylers':[{'saturation':'-100'},{'gamma':'1.00'}]},{'featureType':'road','elementType':'labels.text','stylers':[{'gamma':'0.50'}]},{'featureType':'road','elementType':'labels.icon','stylers':[{'saturation':'-100'},{'gamma':'0.50'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'},{'saturation':'-100'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'lightness':'-13'}]},{'featureType':'road.highway','elementType':'labels.icon','stylers':[{'lightness':'0'},{'gamma':'1.09'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'},{'saturation':'-100'},{'lightness':'47'}]},{'featureType':'road.arterial','elementType':'geometry.stroke','stylers':[{'lightness':'-12'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'},{'lightness':'77'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'lightness':'-5'},{'saturation':'-100'}]},{'featureType':'road.local','elementType':'geometry.stroke','stylers':[{'saturation':'-100'},{'lightness':'-15'}]},{'featureType':'transit.station.airport','elementType':'geometry','stylers':[{'lightness':'47'},{'saturation':'-100'}]},{'featureType':'water','elementType':'all','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]},{'featureType':'water','elementType':'geometry','stylers':[{'saturation':'53'}]},{'featureType':'water','elementType':'labels.text.fill','stylers':[{'lightness':'-42'},{'saturation':'17'}]},{'featureType':'water','elementType':'labels.text.stroke','stylers':[{'lightness':'61'}]}]
    };

    GMap.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    currentLocation();

    var image = 'data:image/png;base64,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';
    var myLatLng = new google.maps.LatLng(25.0372264, 121.506378);
    var centerMarker = new google.maps.Marker({
      position: myLatLng,
      map: GMap.map,
      icon: image
    });

    google.maps.event.addListener(GMap.map, 'idle', function() {
      centerMarker.setPosition(GMap.map.getCenter());
      console.log(GMap.map.getCenter().toString());
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, GMap.map);

    centerControlDiv.index = 1;
    GMap.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    callback();
  }

  var GMap = {
    initMap: initMap,
    map: {}
  };

  // transport
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(GMap);
  } else {
    // browser global
    window.GMap = GMap;
  }

})(window);
