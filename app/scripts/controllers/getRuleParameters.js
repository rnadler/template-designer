'use strict';


angular.module('templateDesignerApp').controller('GetRuleParametersCtrl', function ($scope, $modalInstance, message, rule, selections) {

  $scope.rule = rule;
  $scope.message = message;
  $scope.selections = selections;

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
