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
    var supportedJsonVersion = '6.0',
        jsonVersion = '7.0',
        showAlert = function(alert, message) {
          alert.message = message;
          alert.enabled = true;
          $timeout(function() {
            alert.message = undefined;
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
    $scope.configLoadSuccessAlert = {enabled: false};
    $scope.configSaveSuccessAlert = {enabled: false};
    $scope.badJsonAlert = {enabled: false};
    $scope.mainDivClass = undefined;
    $scope.maxRows = 4;
    $scope.maxColumns = 4;
    $scope.ruleTypes = ComplianceRules.getRuleTypes();
    $scope.configData  = {};
    $scope.groupQuickAdd = {text: undefined};
    $scope.ruleQuickAdd = {text: undefined};
    $scope.cellSizes = Templates.getCellSizes();

    //region ------------- Helper functions -----------

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

    var quickAdd = function (userText, configData, map, callback) {
      if (userText.text === undefined) {
        return 0;
      }
      var saved = 0,
        lines = userText.text.split(/\r\n|\r|\n/g);
      userText.text = undefined;
      if (lines.length > 0) {
        var i;
        for (i = 0; i < lines.length; i++) {
          var tokens = lines[i].split(configData.quickAddLineRegex);
          if (tokens.length === map.length) {
            if (callback(tokens, map)) {
              saved = saved + 1;
            }
          }
        }
      }
      console.log('quickAdd: Added ' + saved + ' entries from ' + lines.length + ' text lines.');
      return saved;
    };
    //endregion

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
      if (aggregate === undefined || aggregate.version === undefined || aggregate.complianceRules === undefined ||
              aggregate.groups === undefined || aggregate.templates === undefined) {
        if (doAlert) {
          showAlert($scope.badJsonAlert, 'Incorrect JSON content.');
        }
        return;
      }
      if (aggregate.version < supportedJsonVersion) {
        if (doAlert) {
          showAlert($scope.projectVersionAlert);
        }
        return;
      }
      $timeout(function() {
        $scope.$apply(function () {
          $scope.rules = ComplianceRules.setRules(aggregate.complianceRules, replace);
          $scope.complinaceRulesGridOptions.data = $scope.rules;
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
        showAlert($scope.badJsonAlert, 'Unable to load JSON file.');
        return;
      }
      if ($window.File && $window.FileList && $window.FileReader) {
        var jsonfile = element.files[0],
            reader = new $window.FileReader();
        reader.onload = function (e) {
          try {
            loadJsonData(angular.fromJson(e.target.result), jsonfile, replace, true);
          } catch (e) {
            showAlert($scope.badJsonAlert, e.message);
          }
        };
        reader.readAsText(jsonfile);
      } else {
        alert('Your browser does not support the File API!'); // jshint ignore:line
      }
    };
    $scope.loadDefaultDataJson = function () {
      $http.get('json/default-data.json').
        success(function (data) {
          loadJsonData(data, undefined, true, false);
        }).
        error(function () {
          alert('Failed to load default JSON content!!'); // jshint ignore:line
        });
    };
    //endregion

    //region ------------- Configuration management ---------------

    $scope.writeConfigJson = function() {
      var data = {
          selections: $scope.configData.selections,
          colors: $scope.configData.colors,
          languages: $scope.languages,
          countries: $scope.countries
        },
        blob = new Blob([angular.toJson(data, true)], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, $scope.configData.name + '.json'); // jshint ignore:line
      showAlert($scope.configSaveSuccessAlert);
    };

    $scope.loadConfigFile = function()
    {
      $timeout(function() {
        jQuery('#loadConfigJsonfile').click(); // jshint ignore:line
      });
    };

    var loadConfigJson = function(data, jsonfile, doAlert) {
      if (data === undefined || data.colors === undefined || data.selections === undefined ||
        data.languages === undefined || data.countries === undefined) {
        showAlert($scope.badJsonAlert, 'Incorrect JSON content.');
        return;
      }
      $timeout(function() {
        $scope.$apply(function () {
          $scope.configData.name = jsonfile.name.replace(/\.[^/.]+$/, ''); // strip extension
          $scope.configData.quickAdd = data.quickAdd;
          $scope.configData.quickAddLineRegex = new RegExp($scope.configData.quickAdd.lineRegex);
          $scope.configData.colors = data.colors;
          $scope.configData.selections = data.selections;
          $scope.languages = Languages.setLanguages(data.languages);
          $scope.countries = Countries.setCountries(data.countries);
          if (doAlert) {
            showAlert($scope.configLoadSuccessAlert);
          }
        });
      });
    };

    $scope.readConfigJson = function(element) {
      if (!element || !element.files || !element.files[0]) {
        showAlert($scope.badJsonAlert, 'Unable to load JSON file.');
        return;
      }
      if ($window.File && $window.FileList && $window.FileReader) {
        var jsonfile = element.files[0],
            reader = new $window.FileReader();
        reader.onload = function (e) {
          try {
            loadConfigJson(angular.fromJson(e.target.result), jsonfile, true);
          } catch (e) {
            showAlert($scope.badJsonAlert, e.message);
          }
        };
        reader.readAsText(jsonfile);
      } else {
        alert('Your browser does not support the File API!'); // jshint ignore:line
      }
    };
    $scope.loadDefaultConfigJson = function () {
      $http.get('json/default-config.json').
        success(function (data) {
          loadConfigJson(data, { name: 'default.json'}, false);
        }).
        error(function () {
          alert('Failed to load default config JSON content!!'); // jshint ignore:line
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
    $scope.getCellHeight = function(row, col) {
      return $scope.template.grid.getCell(row, col).size === CellSize.REGULAR ? 20 : 40; // jshint ignore:line
    };
    $scope.showCellInfo = function(row, col) {
      return $scope.getCellGroup(row, col).name !== blank; // jshint ignore:line
    };
    $scope.setCellName = function(row, col, name) {
      $scope.template.grid.setCell(row, col, name, $scope.getCell(row, col).color, $scope.getCell(row, col).size);
    };
    $scope.setCellColor = function(row, col, color) {
      $scope.template.grid.setCell(row, col, $scope.getCell(row, col).name, color, $scope.getCell(row, col).size);
    };
    $scope.setCellSize = function(row, col, size) {
      $scope.template.grid.setCell(row, col, $scope.getCell(row, col).name, $scope.getCell(row, col).color, size);
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
            return { colors: $scope.configData.colors };
          }
        }
      });

      modalInstance.result.then(function (color) {
        if (color !== undefined) {
          $scope.setCellColor(row, col, color);
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
      if (quickAdd($scope.groupQuickAdd, $scope.configData, $scope.configData.quickAdd.groupMap, function (tokens, groupMap) {
          if (Groups.addGroup(new Message(tokens[groupMap[0]], tokens[groupMap[1]], tokens[groupMap[1]])) === -1) { // jshint ignore:line
            showAlert($scope.groupAlert);
            return false;
          } else {
            return true;
          }
        }) > 0) {
        return;
      }
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
          if (Groups.addGroup(new Message(groupName.trimmed, groupName.raw, groupName.raw)) === -1) { // jshint ignore:line
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

    $scope.complinaceRulesGridOptions = {
      //enableSorting: true,
      rowHeight: 115,
      enableColumnResize : true,
      enableColumnMenus: false,
      enableSorting: false,
      columnDefs: [
        { name:'ID', cellTemplate: 'cell-id' },
        { name: 'Name',
          headerCellTemplate: '<div class="ui-grid-cell-contents">Name [{{grid.appScope.language.code}}]</div>',
          cellTemplate: 'cell-rule-name'},
        { name:'Description',
          headerCellTemplate: '<div class="ui-grid-cell-contents">Description [{{grid.appScope.language.code}}]</div>',
          cellTemplate: 'cell-rule-desc'},
        { name:'Type', cellTemplate: 'cell-ruletype', width: 100},
        { name:'Parameters', cellTemplate: 'cell-parameters' },
        { name:'Countries', cellTemplate: 'cell-countries' },
        { name:'X', cellTemplate: 'cell-delete', headerTooltip: 'Delete compliance rule', width: 40 }
      ]
    };

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
      if (quickAdd($scope.ruleQuickAdd, $scope.configData, $scope.configData.quickAdd.ruleMap, function(tokens, ruleMap) {
        var rv = ComplianceRules.addFromText(tokens, ruleMap, $scope.countries);
          if (!rv) {
            showAlert($scope.ruleAlert);
          }
          return rv;
      }) > 0) {
        return;
      }
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
        if (ComplianceRules.addRule(new RuleDesc(ruleName.trimmed, ruleName.raw, ruleName.raw)) === -1) { // jshint ignore:line
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
            selections: function () {
              return $scope.configData.selections;
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

    $scope.loadDefaultConfigJson();
    $scope.loadDefaultDataJson();

  });
