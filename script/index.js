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

  $(function ($) {

    $app.removeClass("hidden");
    FastClick.attach(document.body);

    var FlatUI = new MYAPP.FlatUI('#sidebar-wrapper');

    $(".iui-overlay").find("button").on("click", function () {

      pauseVideo();

      GMap.initialize(function () {
        console.log('initialize');
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

      });

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
