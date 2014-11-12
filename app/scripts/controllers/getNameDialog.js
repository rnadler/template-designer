'use strict';

angular.module('templateDesignerApp').controller('GetNameDialogCtrl', function ($scope, $modalInstance, type) {

  $scope.enteredName = '';
  $scope.type = type;

  $scope.ok = function () {
    $modalInstance.close($scope.enteredName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
