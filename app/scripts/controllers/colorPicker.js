'use strict';

angular.module('templateDesignerApp').controller('ColorPickerCtrl', function ($scope, $window, $timeout, $modalInstance, type, colorsData) {
  var updateRows = function() {
      var i, j,
        index = 0,
        maxCols = 6,
        maxRows = 50;
      $scope.rows = [];
      for(i = 0 ; i < maxRows; i++){
        $scope.rows.push([]);
        for(j = 0 ; j < maxCols;j++) {
          if (index >= $scope.colorsData.colors.length) {
            return;
          }
          $scope.rows[i][j] = $scope.colorsData.colors[index++];
        }
      }
    };
  $scope.colorsData = colorsData;
  updateRows();
  $scope.type = type;

  $scope.closeDialog = function(color) {
    $modalInstance.close(color);
  };
  $scope.ok = function (color) {
    $scope.closeDialog(color);
  };

  $scope.cancel = function () {
    $scope.closeDialog();
  };
});
