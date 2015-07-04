'use strict';

angular.module('templateDesignerApp').directive('tdParameterEdit', function() {
  return {
    restrict: 'E',
    scope: {
      value: '=ngModel',
      title: '@',
      selection: '='
    },
    templateUrl: 'views/templates/parameterEditor.html',
    link: function(scope) {
      scope.setValue = function(val) {
        scope.value = val;
      };
    }
  };
});
