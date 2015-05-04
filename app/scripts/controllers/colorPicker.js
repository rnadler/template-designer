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
angular.module('templateDesignerApp').controller('ColorPickerCtrl', function ($scope, $window, $timeout, $modalInstance, type, colorsData) {
  var showAlert = function (alert) {
      alert.enabled = true;
      $timeout(function () {
        alert.enabled = false;
      }, 5000);
    },
    defaultColorsData = {
      name: 'colors',
      colors: colors
    },
    updateRows = function() {
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
  $scope.colorsLoadSuccessAlert = {enabled: false};
  $scope.colorsSaveSuccessAlert = {enabled: false};
  $scope.colorsData = colorsData === undefined ? defaultColorsData : colorsData;
  updateRows();
  $scope.type = type;

  $scope.writeColorJson = function() {
    var blob = new Blob([angular.toJson($scope.colorsData.colors, true)], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, $scope.colorsData.name + '.json'); // jshint ignore:line
    showAlert($scope.colorsSaveSuccessAlert);
  };

  $scope.loadColorFile = function()
  {
    $timeout(function() {
      jQuery('#loadColorsJsonfile').click(); // jshint ignore:line
    });
  };

  $scope.readColorsJson = function(element) {
    if (!element || !element.files || !element.files[0]) {
      return;
    }
    if ($window.File && $window.FileList && $window.FileReader) {
      var jsonfile = element.files[0],
        reader = new $window.FileReader();
      reader.onload = function (e) {
        $timeout(function() {
          $scope.$apply(function () {
            $scope.colorsData.name = jsonfile.name.replace(/\.[^/.]+$/, ''); // strip extension
            $scope.colorsData.colors = angular.fromJson(e.target.result);
            updateRows();
            showAlert($scope.colorsLoadSuccessAlert);
          });
        });
      };
      reader.readAsText(jsonfile);
    } else {
      alert('Your browser does not support the File API!'); // jshint ignore:line
    }
  };
  $scope.closeDialog = function(color) {
    $scope.colorsData.color = color;
    $modalInstance.close($scope.colorsData);
  };
  $scope.ok = function (color) {
    $scope.closeDialog(color);
  };

  $scope.cancel = function () {
    $scope.closeDialog();
  };
});
