'use strict';

describe('Controller: GetNameDialogCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  it('should trim strings if trim is true',
    inject(function ($controller, $rootScope) {
      var result,
          scope = $rootScope.$new();
      $controller('GetNameDialogCtrl', {
        $scope: scope,
        $modalInstance: null,
        message: 'name',
        defaultName: 'default name',
        trim: true
      });
      result = scope.removeWhiteSpace(' aaa BBB ccc ');
      expect(result.trimmed).toBe('aaaBBBccc');
      expect(result.raw).toBe(' aaa BBB ccc ');
    }));

  it('should not trim strings if trim is false',
    inject(function ($controller, $rootScope) {
      var scope = $rootScope.$new();
      $controller('GetNameDialogCtrl', {
        $scope: scope,
        $modalInstance: null,
        message: 'name',
        defaultName: 'default name',
        trim: false
      });
      expect(scope.removeWhiteSpace(' aaa BBB ccc ')).toBe(' aaa BBB ccc ');
    }));
});

