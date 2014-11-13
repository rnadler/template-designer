'use strict';

var colors = [
  {name: 'Aqua', color: '#00FFFF'},
  {name: 'Black', color: '#000000'},
  {name: 'Blue', color: '#0000FF'},
  {name: 'Fuchsia', color: '#FF00FF'},
  {name: 'Gray', color: '#808080'},
  {name: 'Green', color: '#008000'},
  {name: 'Lime', color: '#00FF00'},
  {name: 'Maroon', color: '#800000'},
  {name: 'Navy', color: '#000080'},
  {name: 'Olive', color: '#808000'},
  {name: 'Purple', color: '#800080'},
  {name: 'Red', color: '#FF0000'},
  {name: 'Silver', color: '#C0C0C0'},
  {name: 'Teal', color: '#008080'},
  {name: 'White', color: '#FFFFFF'},
  {name: 'Yellow', color: '#FFFF00'}
];

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

    // Color grid
    $scope.colors = colors;
    $scope.color_columns = 4;
    $scope.color_rows = colors.length/$scope.color_columns;
    $scope.getColor = function (row, col) {
      return $scope.colors[(row * $scope.color_columns) + col];
    };

    $scope.setGroup = function(group) {
      $scope.group = group;
    };

    $scope.setTemplate = function(template) {
      $scope.template = template;
    };

    $scope.setRows = function(n) {
      $scope.template.rows = n;
    };
    $scope.setColumns = function(n) {
      $scope.template.setColumns(n);
    };

    // ----------- Template management ---------------

    $scope.addTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          type: function () {
            return 'Template';
          }
        }
      });

      modalInstance.result.then(function (templateName) {
        if (templateName !== '') {
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

    // ----------- Rule Group management ---------------

    $scope.addGroup = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          type: function () {
            return 'Rule Group';
          }
        }
      });

      modalInstance.result.then(function (group) {
        if (group !== '') {
          Groups.addGroup(group);
          $scope.setGroup($scope.groups[$scope.groups.length - 1]);
        }
      });
    };

    $scope.removeGroup = function(group) {
      var modalInstance = $modal.open({
        templateUrl: 'actionConfirm.html',
        controller: 'ActionConfirmCtrl',
        resolve: {
          message: function () {
            return 'Are you sure you want to delete the ' + group + ' rule group?';
          },
          action: function() {
            return 'Yes, Delete';
          }
        }
      });

      modalInstance.result.then(function () {
        var index = Groups.removeGroup(group);
        if (index > -1) {
          var last = $scope.groups.length - 1;
          if (index > last) {
            index = last;
          }
          $scope.setGroup($scope.groups[index]);
        }
      });
    };

    $scope.setTemplate($scope.templates[0]);
    $scope.setGroup($scope.groups[0]);

  });
