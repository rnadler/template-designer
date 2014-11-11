'use strict';

angular.module('templateDesignerApp').controller('AddTemplateCtrl', function ($scope, $modalInstance) {

  $scope.templateName = '';

  $scope.ok = function () {
    $modalInstance.close($scope.templateName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
