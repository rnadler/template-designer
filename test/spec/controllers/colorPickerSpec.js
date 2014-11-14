'use strict';

describe('Controller: ColorPickerCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var ColorPickerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ColorPickerCtrl = $controller('ColorPickerCtrl', {$scope: scope, $modalInstance: null, type: 'mycolor'});
  }));

  it('should attach the colors to the scope', function () {
    expect(scope.type).toBe('mycolor');
    expect(scope.colors.length).toBe(16);
    var color = scope.getColor(1, 0);
    expect(color.name).toBe('Gray');
    expect(color.color).toBe('#808080');
  });
});
