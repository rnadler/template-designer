'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope, $window, $timeout, Templates, Groups, $modal, unsavedChanges, Languages, ComplianceRules) {
    var jsonVersion = '4.0',
        jsonVersionNoRules = '3.0',
        showAlert = function(alert) {
          alert.enabled = true;
          $timeout(function() {
            alert.enabled = false;
          }, 5000);
        };
    $scope.projectData = {
      name: '',
      version: jsonVersion
    };
    $scope.projectLoadSuccessAlert = {enabled: false};
    $scope.projectSaveSuccessAlert = {enabled: false};
    $scope.groupAlert = {enabled: false};
    $scope.ruleAlert = {enabled: false};
    $scope.templateAlert = {enabled: false};
    $scope.projectChangesPendingAlert = {enabled: false};
    $scope.projectVersionAlert = {enabled: false};
    $scope.maxRows = 4;
    $scope.maxColumns = 4;
    $scope.templates = Templates.getTemplates();
    $scope.groups = Groups.getGroups();
    $scope.languages = Languages.getLanguages();
    $scope.rules = ComplianceRules.getRules();

    $scope.setLanguage = function(language) {
      $scope.language = language;
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
              version: jsonVersion,
              complianceRules: $scope.rules,
              groups: $scope.groups,
              templates: $scope.templates
      };
      var blob = new Blob([JSON.stringify(aggregate, null, '\t')], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, projectName + '.json'); // jshint ignore:line
      $scope.projectData.name = projectName;
      showAlert($scope.projectSaveSuccessAlert);
      $scope.reset();
    };

    $scope.addFile = function()
    {
      jQuery('#addJsonfile').click(); // jshint ignore:line
    };
    $scope.loadFile = function()
    {
      if ($scope.changesArePending()) {
        showAlert($scope.projectChangesPendingAlert);
        return;
      }
      jQuery('#loadJsonfile').click(); // jshint ignore:line
    };
    $scope.readJson = function(element, replace) {
      if (!element || !element.files || !element.files[0]) {
        return;
      }
      if ($window.File && $window.FileList && $window.FileReader) {
        var jsonfile = element.files[0],
            reader = new $window.FileReader();
        reader.onload = function (e) {
          var aggregate = JSON.parse(e.target.result);
          if (aggregate.version === undefined || aggregate.version < jsonVersionNoRules) {
            showAlert($scope.projectVersionAlert);
            return;
          }
          $scope.$apply(function () {
            if (aggregate.version === jsonVersion) {
              $scope.rules = ComplianceRules.setRules(aggregate.complianceRules, replace);
            }
            $scope.groups = Groups.setGroups(aggregate.groups, replace);
            $scope.templates = Templates.setTemplates(aggregate.templates, replace);
            if (replace) {
              $scope.projectData.name = jsonfile.name.replace(/\.[^/.]+$/, ''); // strip extension
              $scope.reset();
            }
            showAlert($scope.projectLoadSuccessAlert);
          });
        };
        reader.readAsText(jsonfile);
      } else {
        alert('Your browser does not support the File API!'); // jshint ignore:line
      }
    };

    // ------------ Cell management ---------------

    $scope.cellWidth = function() {
      return 100/$scope.template.getColumns() + '%';
    };
    $scope.getCell = function(row, col) {
        return $scope.template.grid.getCell(row, col);
    };
    $scope.getCellGroup = function(row, col) {
      return Groups.findGroup($scope.getCell(row, col).name);
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

    $scope.editTemplate = function(template) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename Template Name';
          },
          defaultName: function () {
            return template.getName();
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (templateName) {
        if (Templates.hasTemplate(templateName)) {
          showAlert($scope.templateAlert);
          return;
        }
        template.setName(templateName);
      });
    };

    $scope.editTemplateDesc = function(template) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Template Description';
          },
          defaultName: function () {
            return template.getMessageString($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (templateDesc) {
        template.addMessageString(templateDesc, $scope.language);
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
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (templateName) {
          if (Templates.addTemplate(templateName, $scope.maxRows, $scope.maxColumns) === -1) {
            showAlert($scope.templateAlert);
            return;
          }
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

    $scope.editGroup = function(group) {
      var oldGroup = group;
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename Rule Group Name';
          },
          defaultName: function () {
            return group.name;
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (groupName) {
        var newGroup = Groups.dupGroup(oldGroup);
        newGroup.name = groupName;
        var index = Groups.changeGroup(oldGroup, newGroup);
        if (index > -1) {
          Templates.updateGroupName(oldGroup.name, groupName);
        } else {
          showAlert($scope.groupAlert);
        }
      });
    };

    $scope.editGroupDesc = function(group) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Rule Group Description';
          },
          defaultName: function () {
            return group.getString($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (groupDesc) {
        group.addString(groupDesc, $scope.language);
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
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (groupName) {
          if (Groups.addGroup(new Message(groupName)) === -1) { // jshint ignore:line
            showAlert($scope.groupAlert);
          }
      });
    };

    $scope.removeGroup = function(group) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/actionConfirm.html',
        controller: 'ActionConfirmCtrl',
        resolve: {
          message: function () {
            return 'Are you sure you want to delete the ' + group.name + ' compliance rule?';
          },
          action: function() {
            return 'Yes, Delete';
          }
        }
      });

      modalInstance.result.then(function () {
        var index = Groups.removeGroup(group);
        if (index > -1) {
          Templates.updateGroupName(group.name, '');
        } else {
          showAlert($scope.groupAlert);
        }
      });
    };

    // ----------- Compliance Rule management ---------------

    $scope.editRule = function(rule) {
      var oldRule = rule;
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename Compliance Rule Name';
          },
          defaultName: function () {
            return rule.name;
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (ruleName) {
        var newRule = ComplianceRules.dupRule(oldRule);
        newRule.name = ruleName;
        if (ComplianceRules.changeRule(oldRule, newRule) === -1) {
          showAlert($scope.ruleAlert);
        }
      });
    };

    $scope.editRuleDesc = function(rule) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Compliance Rule Description';
          },
          defaultName: function () {
            return rule.getString($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (ruleDesc) {
        rule.addString(ruleDesc, $scope.language);
      });
    };

    $scope.addRule = function() {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Enter New Compliance Rule Name';
          },
          defaultName: function () {
            return '';
          },
          trim: function() {
            return true;
          }
        }
      });

      modalInstance.result.then(function (ruleName) {
        if (ComplianceRules.addRule(new RuleDesc(ruleName)) === -1) { // jshint ignore:line
          showAlert($scope.ruleAlert);
        }
      });
    };

    $scope.removeRule = function(rule) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/actionConfirm.html',
        controller: 'ActionConfirmCtrl',
        resolve: {
          message: function () {
            return 'Are you sure you want to delete the ' + rule.name + ' compliance rule?';
          },
          action: function() {
            return 'Yes, Delete';
          }
        }
      });

      modalInstance.result.then(function () {
        var index = ComplianceRules.removeRule(rule);
        if (index === -1) {
          showAlert($scope.ruleAlert);
        }
      });
    };

    $scope.changesArePending = function() {
      return unsavedChanges.fnHasChanges('rule-changes') ||
             unsavedChanges.fnHasChanges('group-changes') ||
             unsavedChanges.fnHasChanges('template-changes') ||
             unsavedChanges.fnHasChanges('project-changes');
    };

    $scope.reset = function() {
      unsavedChanges.fnDetachListeners();
      unsavedChanges.fnAttachListener($scope, 'rule-changes', $scope.rules);
      unsavedChanges.fnAttachListener($scope, 'group-changes', $scope.groups);
      unsavedChanges.fnAttachListener($scope, 'template-changes', $scope.templates);
      unsavedChanges.fnAttachListener($scope, 'project-changes', $scope.projectData);
      $scope.setTemplate($scope.templates[0]);
      $scope.setLanguage($scope.languages[0]);
    };

    $scope.reset();

  });
