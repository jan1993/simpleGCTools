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

    $scope.output = output;
  }
})

.controller('CoordinateCtrl', function($scope) {
  // Dezimalgrad N50.418716°, E006.750000°
  $scope.dezimalgrad = {};
  $scope.dezimalgrad.lat = 37.76770;
  $scope.dezimalgrad.lon = -122.44400;

  //  gradBogenminuten N50°25.123' E006°45.000'
  $scope.gradBogenminuten = {};
  $scope.gradBogenminuten.lat = {};
  $scope.gradBogenminuten.lon = {};

  $scope.calcAll = function(){
    convertDGtoGBM($scope.dezimalgrad.lat, $scope.dezimalgrad.lon);
  }

  function convertDGtoGBM(lat, lon){
    var bogenminuteLat, bogenminuteLon, orientationLat, orientationLon;
    orientationLat = lat >= 0 ? "N" : "S";
    orientationLon = lon >= 0 ? "O" : "W";
    lat = Math.abs(lat);
    lon = Math.abs(lon);
    gradLat = Math.floor(lat);
    gradLon = Math.floor(lon);

    bogenminuteLat = (lat -gradLat) * 60;
    bogenminuteLon = (lon -gradLon) * 60;
    bogenminuteLat = Math.round(bogenminuteLat * 1000) / 1000;
    bogenminuteLon = Math.round(bogenminuteLon * 1000) / 1000;

    console.log("Lat: " + orientationLat + " " + gradLat +"° "+bogenminuteLat);
    console.log("Lat: " + orientationLon + " " + gradLon +"° "+bogenminuteLon);

    $scope.gradBogenminuten.lat.orientation = orientationLat;
    $scope.gradBogenminuten.lat.grad = gradLat;
    $scope.gradBogenminuten.lat.minuten = bogenminuteLat;
    
    $scope.gradBogenminuten.lon.orientation = orientationLon;
    $scope.gradBogenminuten.lon.grad = gradLon;
    $scope.gradBogenminuten.lon.minuten = bogenminuteLon;


  }

});
