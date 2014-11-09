'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of groups and default grid size to the scope', function () {
    expect(scope.groups.length).toBe(7);
    expect(scope.rows).toBe(4);
    expect(scope.columns).toBe(4);
  });
});
