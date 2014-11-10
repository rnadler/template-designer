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

  it('should attach a list of groups to the scope', function () {
    expect(scope.groups.length).toBe(8);
  });
  it('should attach default template to the scope', function () {
    expect(scope.template.name).toContain('template');
    expect(scope.template.rows).toBe(4);
    expect(scope.template.columns()).toBe(4);
  });
  it('should attach a template grid to the scope', function () {
    expect(scope.template.grid.get(2,2)).toBe('None');
    scope.template.grid.set(2,2,'grid22');
    expect(scope.template.grid.get(2,2)).toBe('grid22');
  });
});
