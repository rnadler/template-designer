'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope, Templates, Groups, $modal) {
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
      var modalInstance = $modal.open({
        templateUrl: 'addTemplate.html',
        controller: 'AddTemplateCtrl',
        size: 'sm'
      });

      modalInstance.result.then(function (templateName) {
        if (templateName !== '' && templateName !== 'cancel') {
          Templates.addTemplate(templateName, $scope.maxRows, $scope.maxColumns);
          $scope.setTemplate($scope.templates[$scope.templates.length - 1]);
        }
      });
    };

    $scope.removeTemplate = function(template) {
      var modalInstance = $modal.open({
        templateUrl: 'actionConfirm.html',
        controller: 'ActionConfirmCtrl',
        resolve: {
          message: function () {
            return 'Are you sure you want to delete the ' + template.name + ' template?';
          },
          action: function() {
            return 'Yes, Delete';
          }
        }
      });

      modalInstance.result.then(function () {
        var index = Templates.removeTemplate(template);
        if (index > -1) {
            var last = $scope.templates.length - 1;
            if (index > last) {
              index = last;
            }
          $scope.setTemplate($scope.templates[index]);
        }
      });

    };
    $scope.setTemplate($scope.templates[0]);

  });
