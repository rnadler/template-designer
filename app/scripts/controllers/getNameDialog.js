'use strict';

angular.module('templateDesignerApp').controller('GetNameDialogCtrl', function ($scope, $modalInstance, message, defaultName) {

  $scope.enteredName = defaultName;
  $scope.message = message;

  $scope.ok = function () {
    $modalInstance.close($scope.enteredName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
