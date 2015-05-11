angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.navigate = function(path) {
    console.log("Navigate to: " + path);
    $state.go('app.bww');
  }
})


.controller('BwwCtrl', function($scope) {
  $scope.input = {};
  $scope.output = {}

  var alphabet = " abcdefghijklmnopqrstuvwxyz";

  $scope.calc = function() {
    var str = $scope.input.string;
    str = str.toLowerCase() + "";

    if (!str) return;

    var output = {};
    output.all = ""; // ABC => 1 2 3
    output.sum = 0; // ABC => 6
    output.pro = 0; // ABC => 1*2*3 = 6
    output.charsValid = 0; // A B C = 3
    output.chars = str.length; // A B C = 5

    for (var i = 0; i < str.length; i++) {
      val = alphabet.indexOf(str[i]);
      console.log(val);

      if (val >= 0) {
        if (val > 0) output.charsValid++;
        output.sum += val;
        output.pro = output.pro * val || val;
        output.all += val + " ";
      } else {
        output.all += "invalid ";
      }
    }

    output.qSum = quersumme(output.sum);
    //output.qqSum = qQuersumme(output.sum);

    $scope.output = output;

    function quersumme(val) {
      var sum = 0;
      val = val + "";

      //if (val.length <= 1) return;
      for (var i = 0; i < val.length; i++) {
        sum += val[i] * 1;
      }
      return sum;
    }

    function qQuersumme(val) {
      val += "";

      while (val.length != 1) {
        val = quersumme(val * 1);
        val += "";
      }

      return val;
    }
  }
})

.controller('CoordinateCtrl', function($scope, $cordovaGeolocation, $cordovaClipboard, $ionicPlatform, $cordovaToast) {

  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  // Dezimalgrad N50.418716°, E006.750000°
  $scope.dezimalgrad = {};
  $scope.dezimalgrad.lat = 37.76770;
  $scope.dezimalgrad.lon = -122.44400;

  //  gradBogenminuten N50°25.123' E006°45.000'
  $scope.gradBogenminuten = {};
  $scope.gradBogenminuten.lat = {};
  $scope.gradBogenminuten.lon = {};
  $scope.gradBogenminuten.lat.orientation = "N";
  $scope.gradBogenminuten.lon.orientation = "E";


  $scope.locate = function() {
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function(position) {
        $scope.dezimalgrad.lat = Math.round(position.coords.latitude * 100000) / 100000;
        $scope.dezimalgrad.lon = Math.round(position.coords.longitude * 100000) / 100000;
        $scope.lastActive = "dezimalgrad";
        $scope.calcAll();
      }, function(err) {
        //alert("Positionsbestimmung fehlgeschlagen");
      });
  }

  $scope.copy = function(text) {
    console.log(text);
    $cordovaClipboard
      .copy(text)
      .then(function() {
        $cordovaToast.showShortBottom(text + ' erfolgreich kopiert').then(function(success) {
          // success
        }, function(error) {
          // error
        });

      }, function() {
        // error
      });
  }


  $scope.calcAll = function() {
    if ($scope.lastActive == "dezimalgrad") {
      convertDGtoGBM($scope.dezimalgrad.lat, $scope.dezimalgrad.lon);
    }

    if ($scope.lastActive == "bogenminuten") {
      convertGBMtoDG($scope.gradBogenminuten.lat.orientation, $scope.gradBogenminuten.lat.grad, $scope.gradBogenminuten.lat.minuten, $scope.gradBogenminuten.lon.orientation, $scope.gradBogenminuten.lon.grad, $scope.gradBogenminuten.lon.minuten);

    }

  }
  $scope.change = function(format) {
    $scope.lastActive = format;
  }



  function convertDGtoGBM(lat, lon) {
    var bogenminuteLat, bogenminuteLon, orientationLat, orientationLon;
    orientationLat = lat >= 0 ? "N" : "S"; // +N  -S
    orientationLon = lon >= 0 ? "E" : "W"; // +O  -W
    lat = Math.abs(lat); // Absolute Werte
    lon = Math.abs(lon);
    gradLat = Math.floor(lat); // Nachkommazahlen abschneiden
    gradLon = Math.floor(lon);

    bogenminuteLat = (lat - gradLat) * 60;
    bogenminuteLon = (lon - gradLon) * 60;
    bogenminuteLat = Math.round(bogenminuteLat * 1000) / 1000;
    bogenminuteLon = Math.round(bogenminuteLon * 1000) / 1000;

    console.log("Lat: " + orientationLat + " " + gradLat + "° " + bogenminuteLat);
    console.log("Lat: " + orientationLon + " " + gradLon + "° " + bogenminuteLon);

    $scope.gradBogenminuten.lat.orientation = orientationLat;
    $scope.gradBogenminuten.lat.grad = gradLat;
    $scope.gradBogenminuten.lat.minuten = bogenminuteLat;
    $scope.gradBogenminuten.lon.orientation = orientationLon;
    $scope.gradBogenminuten.lon.grad = gradLon;
    $scope.gradBogenminuten.lon.minuten = bogenminuteLon;
  }

  function convertGBMtoDG(orientationLat, gradLat, bogenminuteLat, orientationLon, gradLon, bogenminuteLon) {
    var lat, lon;
    lat = (bogenminuteLat / 60);
    lon = (bogenminuteLon / 60);
    lat += gradLat * 1;
    lon += gradLon * 1;
    lat = Math.round(lat * 100000) / 100000;
    lon = Math.round(lon * 100000) / 100000;

    if (orientationLat == "S") lat = lat * -1;
    if (orientationLon == "W") lon = lon * -1;

    console.log(lat, lon);

    $scope.dezimalgrad.lat = lat;
    $scope.dezimalgrad.lon = lon;
  }

  $scope.locate();

});
