'use strict';

angular.module('templateDesignerApp').controller('GetNameDialogCtrl', function ($scope, $modalInstance, message, defaultName, trim) {
  $scope.removeWhiteSpace = function(str) {
    return trim === true ? str.replace(/\s/g, '') : str;
  };
  $scope.enteredName = defaultName;
  $scope.defaultName = defaultName;
  $scope.message = message;

  $scope.OkIsActive = function() {
    return $scope.enteredName.length > 0 && $scope.enteredName !== $scope.defaultName;
  };
  $scope.ok = function () {
    $modalInstance.close($scope.removeWhiteSpace($scope.enteredName));
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
