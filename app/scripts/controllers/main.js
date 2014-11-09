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
  });
