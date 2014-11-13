'use strict';

var colors = [
  {name: 'Aqua', color: '#00FFFF'},
  {name: 'Black', color: '#000000'},
  {name: 'Blue', color: '#0000FF'},
  {name: 'Fuchsia', color: '#FF00FF'},
  {name: 'Gray', color: '#808080'},
  {name: 'Green', color: '#008000'},
  {name: 'Lime', color: '#00FF00'},
  {name: 'Maroon', color: '#800000'},
  {name: 'Navy', color: '#000080'},
  {name: 'Olive', color: '#808000'},
  {name: 'Purple', color: '#800080'},
  {name: 'Red', color: '#FF0000'},
  {name: 'Silver', color: '#C0C0C0'},
  {name: 'Teal', color: '#008080'},
  {name: 'White', color: '#FFFFFF'},
  {name: 'Yellow', color: '#FFFF00'}
];
angular.module('templateDesignerApp').controller('ColorPickerCtrl', function ($scope, $modalInstance, type) {

  $scope.type = type;
  // Color grid
  $scope.colors = colors;
  $scope.colorColumns = 4;
  $scope.colorRows = colors.length/$scope.colorColumns;
  $scope.getColor = function (row, col) {
    return $scope.colors[(row * $scope.colorColumns) + col];
  };


  $scope.ok = function (color) {
    $modalInstance.close(color);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
