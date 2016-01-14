'use strict';


(function($) {

  jQuery(function($) {

    var ctx = $("#myChart").get(0).getContext("2d");
    var data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
        label: "My First dataset",
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
      }, {
        label: "My Second dataset",
        fillColor: "rgba(151,187,205,0.5)",
        strokeColor: "rgba(151,187,205,0.8)",
        highlightFill: "rgba(151,187,205,0.75)",
        highlightStroke: "rgba(151,187,205,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
      }]
    };

    var myBarChart = new Chart(ctx).Bar(data);

  });

})(jQuery);

/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

'use strict';

// Extend JS String with repeat method
String.prototype.repeat = function(num) {
    return new Array(Math.round(num) + 1).join(this);
};

(function($) {

    // Add segments to a slider
    $.fn.addSliderSegments = function() {
        return this.each(function() {
            var $this = $(this),
                option = $this.slider('option'),
                amount = (option.max - option.min) / option.step,
                orientation = option.orientation;
            if ('vertical' === orientation) {
                var output = '',
                    i;
                console.log(amount);
                for (i = 1; i <= amount - 1; i + 1) {
                    output += '<div class="ui-slider-segment" style="top:' + 100 / amount * i + '%;"></div>';
                }
                $this.prepend(output);
            } else {
                var segmentGap = 100 / (amount) + '%';
                var segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
                $this.prepend(segment.repeat(amount - 1));
            }
        });
    };

    jQuery(function($) {

        var $slider = $('#slider'),
            $walkSlider = $('#walk-slider'),
            sliderValueMultiplier = 15;

        // Disable link clicks to prevent page scrolling
        $(document).on('click', 'a[href="#fakelink"]', function(e) {
            e.preventDefault();
        });

        // Custom Selects
        if ($('[data-toggle="select"]').length) {
            $('[data-toggle="select"]').select2(); 
        }

        // jQuery UI Sliders
        if ($slider.length > 0) {
            $slider.slider({
                min: 1,
                max: 4,
                value: 2,
                orientation: 'horizontal',
                range: 'min',
                slide: function(event, ui) {
                    var _value = ui.value * sliderValueMultiplier;
                    $slider.find('.ui-slider-value:last').text(_value + ' 分鐘').data('slidervalue', _value);
                }
            }).addSliderSegments($slider.slider('option').max);
        }

        $('.btn-group').on('click', 'a', function() {
            $(this).siblings().removeClass('active').end().addClass('active');
        });

        if ($walkSlider.length > 0) {
            $walkSlider.slider({
                min: 1,
                max: 4,
                value: 2,
                orientation: 'horizontal',
                range: 'min',
                slide: function(event, ui) {
                    var _value = ui.value * sliderValueMultiplier;
                    $walkSlider.find('.ui-slider-value:last').text(_value + ' 分鐘').data('slidervalue', _value);
                }
            }).addSliderSegments($walkSlider.slider('option').max);
        }

        // Checkboxes and Radio buttons
        $('[data-toggle="checkbox"]').radiocheck();
        $('[data-toggle="radio"]').radiocheck();

        // Switches
        if ($('[data-toggle="switch"]').length) {
            $('[data-toggle="switch"]').bootstrapSwitch();
        }

    });

})(jQuery);

'use strict';

(function($) {

  var $slider = $('#slider'),
    $walkSlider = $('#walk-slider'),
    $select = {
      fromtime: $('#select-form-time'),
    },
    $conveyance = $('#article-conveyance'),
    $wrapper = $('#wrapper'),
    $footer = $('#footer');


  jQuery(function($) {

    window.alert = swal;

    $('.iui-overlay').find('.btn-close').on('click', function() {
      classie.addClass(document.getElementById('overlay'), 'hidden');
      GMap.initMap(function() {
        $(window).resize(function(argument) {
          google.maps.event.trigger(GMap.map, 'resize');
          resizeSidebarPanel();
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

    resizeSidebarPanel();

    // $('.iui-overlay').find('.btn-close').click(); //test code;

  });

  var resizeSidebarPanel = function(argument) {
    $('.sidebar-panel').height($(window).height() - 320);
  };

})(jQuery);

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
    controlUI.style.marginBottom = '22px';
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
