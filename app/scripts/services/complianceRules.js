'use strict';

var RuleType = Object.freeze({
  INITIAL: 'initial',
  ONGOING: 'ongoing'
});

var RuleDesc = Class.create(Message, { // jshint ignore:line
  initialize: function($super, string, code, ruleType) {
    $super(string, code);
    this.ruleType = ruleType !== undefined ? ruleType : RuleType.INITIAL;
  }
});

angular.module('ComplianceRulesService', []).service('ComplianceRules', function () {

  var rules = [
        new RuleDesc('cms', 'US CMS Compliance', RuleType.INITIAL),  // jshint ignore:line
        new RuleDesc('rolling', 'French Rolling Compliance', RuleType.INITIAL),  // jshint ignore:line
        new RuleDesc('mask', 'Mask Reimbursement', RuleType.ONGOING)  // jshint ignore:line
      ];
  this.hasRule = function(rule) {
    return this.findRule(rule.name) !== undefined;
  };
  this.getRules = function () {
      return rules;
  };

  this.dupRule = function(oldRule) {
    var message = new RuleDesc(oldRule.name, oldRule.name, oldRule.ruleType); // jshint ignore:line
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
