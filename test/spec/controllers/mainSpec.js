'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('templateDesignerApp'));

  var scope,
      createController,
      httpBackend,
      timeout;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $timeout) {
    scope = $rootScope.$new();
    timeout = $timeout;
    httpBackend = $httpBackend;
    createController = function() {
      return $controller('MainCtrl', {$scope: scope });
    };
  }));

  it('should fetch configuration and default data', function() {
    httpBackend.expectGET('json/default-config.json').respond({selections: {}, colors: [],
      languages: [{code: 'en_US', desc: 'English US'}],
      countries: [{code: 'us', desc: 'United States'}],
      quickAdd: { lineRegex: '\\t|,', groupMap: [1, 0], ruleMap: [2, 0, 1]}});
    httpBackend.whenGET('json/default-data.json').respond({version: '6.0', complianceRules: [],
      groups: [{
        name: '7DaysAllPatients',
        strings: [
          {
            string: '7 Days All Patients',
            desc: 'Patients on therapy for 7 days',
            code: 'en_US'
          }
        ]
      }],
      templates: []});
    httpBackend.expectGET('views/main.html').respond('OK');
    createController();
    httpBackend.flush();
    timeout.flush(100);
    //debugger;
    expect(scope.languages.length).toBe(1);
    expect(scope.countries.length).toBe(1);
    expect(scope.groups.length).toBe(2); // --Blank-- is added by the Groups service

  });
});
