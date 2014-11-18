'use strict';

describe('Controller: IndexCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('IndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a version to the scope', function () {
    expect(scope.templateDesignerVersion.match(/^(\d+)\.(\d+)\.(\d+)-alpha$/).length).toBe(4);
  });
});
