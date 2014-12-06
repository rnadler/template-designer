'use strict';

angular.module('templateDesignerApp').controller('GetNameDialogCtrl', function ($scope, $modalInstance, message, defaultName) {

  $scope.enteredName = defaultName;
  $scope.defaultName = defaultName;
  $scope.message = message;

  $scope.OkIsActive = function() {
    return $scope.enteredName.length > 0 && $scope.enteredName !== $scope.defaultName;
  };
  $scope.ok = function () {
    $modalInstance.close($scope.enteredName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
