'use strict';

angular.module('templateDesignerApp').controller('GetNameDialogCtrl', function ($scope, $modalInstance, message, defaultName, trim) {
  $scope.removeWhiteSpace = function(str) {
    if (trim === true) {
      return { trimmed: str.replace(/\s/g, ''), raw: str};
    }
    return str;
  };
  defaultName = (defaultName === undefined) ? '' : defaultName;
  $scope.enteredName = defaultName;
  $scope.defaultName = defaultName;
  $scope.message = message;

  $scope.OkIsActive = function() {
    return (trim === false || $scope.enteredName.length > 0) && $scope.enteredName !== $scope.defaultName;
  };
  $scope.ok = function () {
    $modalInstance.close($scope.removeWhiteSpace($scope.enteredName));
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
