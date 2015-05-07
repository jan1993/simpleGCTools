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
    str = str.toLowerCase()+"";

    if (!str) return;

    var output = {};
    output.all = ""; // ABC => 1 2 3
    output.sum = 0; // ABC => 6
    output.pro = 0; // ABC => 1*2*3 = 6
    output.charsValid = 0; // A B C = 3
    output.chars = str.length; // A B C = 5

    for (var i = 0; i < str.length; i++) {
      val = alphabet.search(str[i]);
      console.log(val);

      if (val > 0) {
        output.charsValid++;
        output.sum += val;
        output.pro = output.pro * val || val;
        output.all += val + " ";
      }
      else
      {
        output.all += "invalid ";
      }
    }

    $scope.output = output;
  }
});
