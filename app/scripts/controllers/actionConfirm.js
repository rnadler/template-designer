'use strict';

angular.module('templateDesignerApp').controller('ActionConfirmCtrl', function ($scope, $modalInstance, message, action) {

  $scope.message = message;
  $scope.action = action;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
