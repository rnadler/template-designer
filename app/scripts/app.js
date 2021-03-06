'use strict';

/**
 * @ngdoc overview
 * @name templateDesignerApp
 * @description
 * # templateDesignerApp
 *
 * Main module of the application.
 */
angular.module('templateDesignerApp', [
    'TemplatesService',
    'ComplianceRulesService',
    'GroupsService',
    'LanguagesService',
    'CountriesService',
    'rangeFilters',
    'mosSvcs.unsavedChanges',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngTagsInput',
    'angularSpinner',
    'ui.grid',
    'ui.grid.resizeColumns',
    'perfect_scrollbar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
