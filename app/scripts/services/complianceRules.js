'use strict';

angular.module('ComplianceRulesService', []).service('ComplianceRules', function () {

  var rules = [
        new Message('cms', 'US CMS Compliance'),  // jshint ignore:line
        new Message('rolling', 'French Rolling Compliance')  // jshint ignore:line
      ];
  this.hasRule = function(rule) {
    return this.findRule(rule.name) !== undefined;
  };
  this.getRules = function () {
      return rules;
  };

  this.dupRule = function(oldRule) {
    var message = new Message(oldRule.name); // jshint ignore:line
    for (var j = 0; j < oldRule.strings.length; j++) {
      message.addStringCode(oldRule.strings[j].string, oldRule.strings[j].code);
    }
    return message;
  };
  this.setRules = function (grps, replace) {
    if (replace) {
      rules = [];
    }
    for (var i = 0; i < grps.length; i++) {
      this.addRule(this.dupRule(grps[i]));
    }
    return rules;
  };
  this.addRule = function(rule) {
    return this.hasRule(rule) ? -1 : rules.push(rule);
  };
  this.changeRule = function(oldRule, newRule) {
    if (this.hasRule(newRule)) {
      return -1;
    }
    var index = rules.indexOf(oldRule);
    if (index > -1) {
      rules[index] = newRule;
    }
    return index;
  };
  this.removeRule = function(rule) {
    if (rules.length === 1) {
      return -1;
    }
    var index = rules.indexOf(rule);
    if (index > -1) {
      rules.splice(index, 1);
    }
    return index;
  };
  this.findRule = function(ruleName) {
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].name === ruleName) {
        return rules[i];
      }
    }
    return undefined;
  };
});
