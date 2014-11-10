'use strict';

var Grid = function(colunms) {
  this.columns = colunms;
  this.cells = {};
};
Grid.prototype.ordinal = function(row, col) {
  return (col * this.columns) + row;
};
Grid.prototype.set = function(row, col, val) {
  this.cells[this.ordinal(row, col)] = val;
};
Grid.prototype.get = function(row, col) {
  var rv = this.cells[this.ordinal(row, col)];
  return rv === undefined ? 'None': rv;
};

var Template = function(name, rows, columns) {
  this.name = name;
  this.rows = rows;
  this.grid = new Grid(columns);
};
Template.prototype.columns = function() {
  return this.grid.columns;
};
Template.prototype.setColumns = function(columns) {
  this.grid.columns = columns;
};

/**
 * @ngdoc overview
 * @name templateDesignerApp
 * @description
 * # templateDesignerApp
 *
 * Main module of the application.
 */
angular.module('templateDesignerApp', [
    'rangeFilters',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  //,'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


