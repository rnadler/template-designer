'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope, Templates, Groups /*, $modal */) {
    $scope.maxRows = 4;
    $scope.maxColumns = 4;
    $scope.templates = Templates.getTemplates();
    $scope.groups = Groups.getGroups();

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

    $scope.setTemplate($scope.templates[0]);

  });
