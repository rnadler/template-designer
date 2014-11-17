'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope, $window, $timeout, Templates, Groups, $modal) {
    $scope.project = '';
    $scope.projectLoadSuccessAlert = true;
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

    // ------------- Project management -----------

    $scope.writeJson = function(projectName) {
      var aggregate = {
              groups: $scope.groups,
              templates: $scope.templates
      };
      var blob = new Blob([JSON.stringify(aggregate, null, '\t')], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, projectName + '.json');
      $scope.project = projectName;
    };

    $scope.selectFile = function()
    {
      console.log('selectFile -- about to open load dialog');
      $('#jsonfile').click();
    };
    $scope.readJson = function(element) {
      if (!element || !element.files || !element.files[0]) {
        console.log('readJson -- no file to read.');
        return;
      }
      console.log('readJson -- about to load ' + element.files[0].name);
      if ($window.File && $window.FileList && $window.FileReader) {
        var jsonfile = element.files[0],
            reader = new $window.FileReader();
        reader.onload = function (e) {
          var aggregate = JSON.parse(e.target.result);
          $scope.$apply(function () {
            $scope.groups = Groups.setGroups(aggregate.groups);
            $scope.templates = Templates.setTemplates(aggregate.templates);
            $scope.project = jsonfile.name.replace(/\.[^/.]+$/, ''); // strip extension
            console.log('readJson -- loaded ' + $scope.project);
            $scope.projectLoadSuccessAlert = false;
            $timeout(function() {
              $scope.projectLoadSuccessAlert = true;
            }, 5000);
            $scope.reset();
          });
          $('#jsonfile').val('');
        };
        reader.readAsText(jsonfile);
      } else {
        alert('Your browser does not support the File API!');
      }
    };

    // ------------ Cell management ---------------

    $scope.cellWidth = function() {
      return 100/$scope.template.getColumns() + '%';
    };
    $scope.getCell = function(row, col) {
        return $scope.template.grid.getCell(row, col);
    };
    $scope.setCellName = function(row, col, name) {
      $scope.template.grid.setCell(row, col, name, $scope.getCell(row, col).color);
    };
    $scope.setCellColor = function(row, col, color) {
      $scope.template.grid.setCell(row, col, $scope.getCell(row, col).name, color);
    };
    $scope.selectColor = function(row, col) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/colorPicker.html',
        controller: 'ColorPickerCtrl',
        resolve: {
          type: function () {
            return $scope.getCell(row, col).name;
          }
        }
      });

      modalInstance.result.then(function (color) {
        $scope.setCellColor(row, col, color);
      });
    };

    // ----------- Template management ---------------

    $scope.editTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename Template Name';
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
        templateUrl: 'views/templates/getNameDialog.html',
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
        templateUrl: 'views/templates/actionConfirm.html',
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
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename Rule Group Name';
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
        templateUrl: 'views/templates/getNameDialog.html',
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
        templateUrl: 'views/templates/actionConfirm.html',
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

    $scope.reset = function() {
      $scope.setTemplate($scope.templates[0]);
      $scope.setGroup($scope.groups[0]);
    };

    $scope.reset();

  });
