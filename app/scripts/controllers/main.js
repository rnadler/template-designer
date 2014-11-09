'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.groups = [
      '7daysAllPatients',
      '30daysAllPatients',
      '90daysAllPatients',
      'NoData',
      '7daysAtRisk',
      '30daysAtRisk',
      'InCompliance'
    ];
    $scope.setRows = function(n) {
      $scope.rows = n;
    };
    $scope.setColumns = function(n) {
      $scope.columns = n;
    };
    $scope.setRows(4);
    $scope.setColumns(4);
  });
