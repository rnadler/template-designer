'use strict';

describe('Controller: ColorPickerCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var ColorPickerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ColorPickerCtrl = $controller('ColorPickerCtrl', {$scope: scope, $modalInstance: null, type: 'mycolor', colorsData: undefined});
  }));

  it('should attach the colors to the scope', function () {
    expect(scope.type).toBe('mycolor');
    expect(scope.colorsData.colors.length).toBe(16);
    expect(scope.colorsData.name).toBe('colors');
    var color = scope.rows[0][4];
    expect(color.name).toBe('Gray');
    expect(color.color).toBe('#808080');
  });
});
