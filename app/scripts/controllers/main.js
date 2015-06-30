'use strict';

/**
 * @ngdoc function
 * @name templateDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the templateDesignerApp
 */
angular.module('templateDesignerApp')
  .controller('MainCtrl', function ($scope, $window, $timeout, Templates, Groups, $modal, unsavedChanges, Languages, ComplianceRules, Countries, $http, usSpinnerService) {
    var jsonVersion = '6.0',
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
    $scope.mainDivClass = undefined;
    $scope.maxRows = 4;
    $scope.maxColumns = 4;
    $scope.languages = Languages.getLanguages();
    $scope.ruleTypes = ComplianceRules.getRuleTypes();
    $scope.countries = Countries.getCountries();

    $scope.loadCountries = function(query) {
      return Countries.queryCountries(query);
    };
    $scope.validateCountry = function(tag) {
      return Countries.findCountry(tag.code) !== undefined;
    };

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

    //region ------------- Translations -----------

    $scope.showTranslation = function() {
      return $scope.language.code !== usEnglishCode; // jshint ignore:line
    };
    $scope.getTranslations = function(message) {
      usSpinnerService.spin('spinner-main');
      $scope.mainDivClass = 'pointer-events-none';
      message.translateToLanguage($http, $scope.language, function() {
        usSpinnerService.stop('spinner-main');
        $scope.mainDivClass = undefined;
      });
    };
    //endregion

    //region ------------- Project management -----------

    $scope.writeJson = function(projectName) {
      var aggregate = {
              version: jsonVersion,
              complianceRules: $scope.rules,
              groups: $scope.groups,
              templates: $scope.templates
      };
      var blob = new Blob([angular.toJson(aggregate, true)], {type: 'text/plain;charset=utf-8'});
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
    var loadJsonData = function(aggregate, jsonfile, replace, doAlert) {
      if (aggregate.version === undefined || aggregate.version !== jsonVersion) {
        if (doAlert) {
          showAlert($scope.projectVersionAlert);
        }
        return;
      }
      $timeout(function() {
        $scope.$apply(function () {
          $scope.rules = ComplianceRules.setRules(aggregate.complianceRules, replace);
          $scope.groups = Groups.setGroups(aggregate.groups, replace);
          $scope.templates = Templates.setTemplates(aggregate.templates, replace);
          if (replace) {
            if (jsonfile !== undefined) {
              $scope.projectData.name = jsonfile.name.replace(/\.[^/.]+$/, ''); // strip extension
            }
            $scope.reset();
          }
          if (doAlert) {
            showAlert($scope.projectLoadSuccessAlert);
          }
        });
      });
    };
    $scope.readJson = function(element, replace) {
      if (!element || !element.files || !element.files[0]) {
        return;
      }
      if ($window.File && $window.FileList && $window.FileReader) {
        var jsonfile = element.files[0],
            reader = new $window.FileReader();
        reader.onload = function (e) {
          loadJsonData(angular.fromJson(e.target.result), jsonfile, replace, true);
        };
        reader.readAsText(jsonfile);
      } else {
        alert('Your browser does not support the File API!'); // jshint ignore:line
      }
    };
    var loadDefaultJson = function () {
      $http.get('json/default-data.json').
        success(function (data) {
          loadJsonData(data, undefined, true, false);
        }).
        error(function () {
          console.error('Failed to load default JSON content!!');
        });
    };
    //endregion

    //region ------------- Cell management ---------------

    $scope.cellWidth = function() {
      return 100/$scope.template.getColumns() + '%';
    };
    $scope.getCell = function(row, col) {
        return $scope.template.grid.getCell(row, col);
    };
    $scope.getCellGroup = function(row, col) {
      return Groups.findGroup($scope.getCell(row, col).name);
    };
    $scope.getGroupDropDownName = function(group) {
      var translated = group.getString($scope.language);
      if (translated === group.name) {
        return translated;
      }
      return translated + ' (' + group.name + ')';
    };
    $scope.getGroupDescText = function(group) {
      var translated = group.getDesc($scope.language);
      if (translated === group.name) {
        return translated;
      }
      return translated + ' (' + group.name + ')';
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
        size: 'lg',
        resolve: {
          type: function () {
            return $scope.getCell(row, col).name;
          },
          colorsData: function() {
            return $scope.colorsData;
          }
        }
      });

      modalInstance.result.then(function (colorsData) {
        $scope.colorsData = colorsData;
        if (colorsData.color !== undefined) {
          $scope.setCellColor(row, col, colorsData.color);
        }
      });
    };
    //endregion

    //region ------------- Template management ---------------

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
        if (Templates.hasTemplate(templateName.trimmed)) {
          showAlert($scope.templateAlert);
          return;
        }
        template.setName(templateName.trimmed);
      });
    };

    $scope.editTemplateName = function(template) {
      var modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Template Name';
          },
          defaultName: function () {
            return template.getMessageString($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (templateName) {
        template.addMessageString(templateName, $scope.language);
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
          if (Templates.addTemplate(templateName.trimmed, $scope.maxRows, $scope.maxColumns, templateName.raw) === -1) {
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
    //endregion

    //region ------------- Rule Group management ---------------

    $scope.editGroup = function(group) {
      var oldGroup = group,
          modalInstance = $modal.open({
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
        newGroup.name = groupName.trimmed;
        var index = Groups.changeGroup(oldGroup, newGroup);
        if (index > -1) {
          Templates.updateGroupName(oldGroup.name, groupName.trimmed);
        } else {
          showAlert($scope.groupAlert);
        }
      });
    };

    $scope.editGroupDesc = function(group) {
      var oldGroupName = group.getString($scope.language),
        modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'lg',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Rule Group Description';
          },
          defaultName: function () {
            return group.getDesc($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (groupDesc) {
        group.addString(oldGroupName, groupDesc, $scope.language);
      });
    };
    $scope.editGroupName = function(group) {
      var oldGroupDesc = group.getDesc($scope.language),
        modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'sm',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Rule Group Name';
          },
          defaultName: function () {
            return group.getString($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (groupName) {
        group.addString(groupName, oldGroupDesc, $scope.language);
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
          if (Groups.addGroup(new Message(groupName.trimmed, groupName.raw)) === -1) { // jshint ignore:line
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
    //endregion

    //region ------------- Compliance Rule management ---------------

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
        newRule.name = ruleName.trimmed;
        if (ComplianceRules.changeRule(oldRule, newRule) === -1) {
          showAlert($scope.ruleAlert);
        }
      });
    };

    $scope.editRuleName = function(rule) {
      var oldRuleDesc = rule.getDesc($scope.language),
          modalInstance = $modal.open({
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

      modalInstance.result.then(function (ruleName) {
        rule.addString(ruleName, oldRuleDesc, $scope.language);
      });
    };

    $scope.editRuleDesc = function(rule) {
      var oldRuleName = rule.getString($scope.language),
          modalInstance = $modal.open({
        templateUrl: 'views/templates/getNameDialog.html',
        controller: 'GetNameDialogCtrl',
        size: 'lg',
        resolve: {
          message: function () {
            return 'Rename ' + $scope.language.description() + ' Compliance Rule Description';
          },
          defaultName: function () {
            return rule.getDesc($scope.language);
          },
          trim: function() {
            return false;
          }
        }
      });

      modalInstance.result.then(function (ruleDesc) {
        rule.addString(oldRuleName, ruleDesc, $scope.language);
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
        if (ComplianceRules.addRule(new RuleDesc(ruleName.trimmed, ruleName.raw)) === -1) { // jshint ignore:line
          showAlert($scope.ruleAlert);
        }
      });
    };

    $scope.editRuleParameters = function(rule) {
      var oldRule = rule,
        modalInstance = $modal.open({
          templateUrl: 'views/templates/getRuleParametersDialog.html',
          controller: 'GetRuleParametersCtrl',
          size: 'sm',
          resolve: {
            message: function () {
              return 'Edit ' + rule.name + ' Parameters';
            },
            rule: function () {
              return ComplianceRules.dupRule(rule);
            },
            trim: function() {
              return false;
            }
          }
        });

      modalInstance.result.then(function (rule) {
        oldRule.setParametersFromRule(rule);
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
    //endregion

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

    loadDefaultJson();

  });
