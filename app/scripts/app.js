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
    'GroupsService',
    'rangeFilters',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
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
  })
  .controller('IndexCtrl', function($scope) {
      $scope.templateDesignerVersion = '0.0.3-alpha';
  });


