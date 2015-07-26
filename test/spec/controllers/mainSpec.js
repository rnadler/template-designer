'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var MainCtrl, // jshint ignore:line
    scope,
    createController,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    //MainCtrl = $controller('MainCtrl', { $scope: scope });
    httpBackend = $httpBackend;
    //httpBackend.whenGET('json/default-config.json').respond({selections: {}, colors: [],
    //  languages: [{code: 'en_US', desc: 'English US'}],
    //  countries: [{code: 'us', desc: 'United States'}]});
    httpBackend.whenGET('json/default-data.json').respond({version: '6.0', complianceRules: [], groups: [], templates: []});
    httpBackend.whenGET('views/main.html').respond('OK');
    createController = function() {
      return $controller('MainCtrl', {$scope: scope });
    };
  }));
/*
  it('should attach a list of groups to the scope', function () {
    expect(scope.groups.length).toBe(8);
  });
  it('should attach default template to the scope', function () {
    expect(scope.template.getName()).toContain('template');
    expect(scope.template.rows).toBe(4);
    expect(scope.template.getColumns()).toBe(4);
  });
  it('should attach a template grid to the scope', function () {
    expect(scope.getCell(2,2).name).toBe('--- Blank ---');
    expect(scope.getCell(2,2).color).toBe('#ffffff');
    scope.setCellName(2,2,'grid22');
    expect(scope.getCell(2,2).name).toBe('grid22');
  });

  it('should attach languages to the scope', function () {
    expect(scope.languages.length).toBe(7);
    //expect(scope.language.code).toBe('en_US');
  });

  it('should attach countries to the scope', function () {
    expect(scope.countries.length).toBe(15);
  });
  */
  it('should fetch configuration and default data', function() {
    //httpBackend.expectGET('views/main.html').respond('OK');
    httpBackend.expectGET('json/default-config.json').respond({selections: {}, colors: [],
      languages: [{code: 'en_US', desc: 'English US'}],
      countries: [{code: 'us', desc: 'United States'}]});
    createController();
    httpBackend.flush();

    //scope.loadDefaultConfigJson();
    //httpBackend.flush();
    //expect(scope.languages.length).toBe(1);
    //expect(scope.countries.length).toBe(1);
    httpBackend.expectGET('json/default-data.json');
    scope.loadDefaultDataJson();
    httpBackend.flush();

  });
});
