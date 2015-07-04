'use strict';

var selections =
{
  rangeDays: [15, 30, 60, 90, 180, 365],
  windowDays: [15, 28, 30, 60, 90, 180, 365],
  thresholdDays: [10, 21, 42, 84, 168],
  thresholdHoursADay: [2, 3, 4, 5, 6]
};

angular.module('templateDesignerApp').controller('GetRuleParametersCtrl', function ($scope, $modalInstance, message, rule) {

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
