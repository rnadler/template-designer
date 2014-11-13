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

    // ------------ Cell management
    $scope.getCell = function(row, col) {
        return $scope.template.grid.getCell(row, col);
    };
    $scope.setCellName = function(row, col, name) {
      $scope.template.grid.getCell(row, col).name = name;
    };
    $scope.selectColor = function(row, col) {
      var modalInstance = $modal.open({
        templateUrl: 'colorPicker.html',
        controller: 'ColorPickerCtrl',
        resolve: {
          type: function () {
            return $scope.template.grid.getCell(row, col).name;
          }
        }
      });

      modalInstance.result.then(function (color) {
        $scope.template.grid.getCell(row, col).color = color;
      });
    };

    // ----------- Template management ---------------

    $scope.editTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Edit Template Name';
          },
          defaultName: function () {
            return $scope.template.name;
          }
        }
      });

      modalInstance.result.then(function (templateName) {
        $scope.template.name = templateName;
      });
    };

    $scope.addTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Enter New Template Name';
          },
          defaultName: function () {
            return '';
          }
        }
      });

      modalInstance.result.then(function (templateName) {
          Templates.addTemplate(templateName, $scope.maxRows, $scope.maxColumns);
          $scope.setTemplate($scope.templates[$scope.templates.length - 1]);
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

    $scope.editGroup = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Edit Rule Group Name';
          },
          defaultName: function () {
            return $scope.group;
          }
        }
      });

      modalInstance.result.then(function (group) {
        var index = Groups.changeGroup($scope.group, group);
        if (index > -1) {
          $scope.group = group;
        }
      });
    };

    $scope.addGroup = function() {
      var modalInstance = $modal.open({
        templateUrl: 'getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Enter New Rule Group Name';
          },
          defaultName: function () {
            return '';
          }
        }
      });

      modalInstance.result.then(function (group) {
          Groups.addGroup(group);
          $scope.setGroup($scope.groups[$scope.groups.length - 1]);
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
