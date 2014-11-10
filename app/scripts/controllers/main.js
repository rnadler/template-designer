'use strict';

var templates = [
  new Template('template-4x4', 4, 4),
  new Template('template-3x3', 3, 3)
];

var groups = [
  'None',
  '7daysAllPatients',
  '30daysAllPatients',
  '90daysAllPatients',
  'NoData',
  '7daysAtRisk',
  '30daysAtRisk',
  'InCompliance'
];

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope /*, $modal */) {
    $scope.maxRows = 4;
    $scope.maxColumns = 4;
    $scope.templates = templates;
    $scope.groups = groups;

    $scope.setTemplate = function(template) {
      $scope.template = template;
    };

    $scope.setRows = function(n) {
      $scope.template.rows = n;
    };
    $scope.setColumns = function(n) {
      $scope.template.setColumns(n);
    };

    $scope.addTemplate = function() {
      //var modalInstance = $modal.open({
      //  templateUrl: 'addTemplate.html',
      //  controller: 'AddTemplateCtrl'
      //});
      //
      //modalInstance.result.then(function (templateName) {
      //  if (templateName !== '' && templateName !== 'cancel') {
      //    $scope.templates.push(new Template(templateName, $scope.maxRows, $scope.maxColumns));
      //  }
      //});
    };

    $scope.setTemplate(templates[0]);

  });
