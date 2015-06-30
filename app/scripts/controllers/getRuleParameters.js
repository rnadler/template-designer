'use strict';

angular.module('templateDesignerApp').controller('GetRuleParametersCtrl', function ($scope, $modalInstance, message, rule) {

  $scope.rule = rule;
  $scope.message = message;

  $scope.OkIsActive = function() {
    return true;
  };
  $scope.ok = function () {
    $modalInstance.close(rule);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
