'use strict';

describe('Controller: ColorPickerCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var ColorPickerCtrl,
    scope,
    colorsData = {
      name: 'colors',
      colors:  [
        {name: 'Aqua', color: '#00FFFF'},
        {name: 'Black', color: '#000000'},
        {name: 'Blue', color: '#0000FF'},
        {name: 'Fuchsia', color: '#FF00FF'},
        {name: 'Gray', color: '#808080'},
        {name: 'Green', color: '#008000'},
        {name: 'Lime', color: '#00FF00'},
        {name: 'Maroon', color: '#800000'},
        {name: 'Navy', color: '#000080'},
        {name: 'Olive', color: '#808000'},
        {name: 'Purple', color: '#800080'},
        {name: 'Red', color: '#FF0000'},
        {name: 'Silver', color: '#C0C0C0'},
        {name: 'Teal', color: '#008080'},
        {name: 'White', color: '#FFFFFF'},
        {name: 'Yellow', color: '#FFFF00'}
      ]
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ColorPickerCtrl = $controller('ColorPickerCtrl', {$scope: scope, $modalInstance: null, type: 'mycolor', colorsData: colorsData});
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
