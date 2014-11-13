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
    expect(scope.getCell(2,2).name).toBe('--- Blank ---');
    expect(scope.getCell(2,2).color).toBe('#ffffff');
    scope.setCellName(2,2,'grid22');
    expect(scope.getCell(2,2).name).toBe('grid22');
  });
});
