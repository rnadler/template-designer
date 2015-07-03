'use strict';

var RuleType = Object.freeze({
  INITIAL: 'initial',
  ONGOING: 'ongoing'
});

var RuleDesc = Class.create(Message, { // jshint ignore:line
  initialize: function($super, string, code, desc, ruleType, countries,
          rangeDays, windowDays, thresholdDays, thresholdHoursADay) {
    $super(string, code, desc);
    this.ruleType = ruleType !== undefined ? ruleType : RuleType.INITIAL;
    this.countries = countries === undefined ? [] : countries;
    this.rangeDays = rangeDays;
    this.windowDays = windowDays;
    this.thresholdDays = thresholdDays;
    this.thresholdHoursADay = thresholdHoursADay;
  },
  setParametersFromRule: function(rule) {
    this.rangeDays = rule.rangeDays;
    this.windowDays = rule.windowDays;
    this.thresholdDays = rule.thresholdDays;
    this.thresholdHoursADay = rule.thresholdHoursADay;
  }
});

angular.module('ComplianceRulesService', []).service('ComplianceRules', function () {

  var rules = [
        new RuleDesc('cms', 'US CMS Compliance', 'Usage above 4 hours for any 21 days in a 30 day window in the first 90 days', // jshint ignore:line
          RuleType.INITIAL),
        new RuleDesc('rolling4', 'French 4 Hour Rolling Compliance', 'Usage over a roling 28 day period, 4 hour threshold', // jshint ignore:line
          RuleType.ONGOING),
        new RuleDesc('rolling3', 'French 3 Hour Rolling Compliance', 'Usage over a roling 28 day period, 3 hour threshold', // jshint ignore:line
          RuleType.ONGOING)
      ];
  this.hasRule = function(rule) {
    return this.findRule(rule.name) !== undefined;
  };
  this.getRules = function () {
      return rules;
  };
  this.getRuleTypes = function() {
    var rv = [];
    for (var property in RuleType) {
      if (RuleType.hasOwnProperty(property)) {
        rv.push(RuleType[property]);
      }
    }
    return rv;
  };
  this.dupRule = function(oldRule) {
    var j,
        ruleDesc = new RuleDesc(oldRule.name, oldRule.code, oldRule.desc, oldRule.ruleType, [],
            oldRule.rangeDays, oldRule.windowDays, oldRule.thresholdDays, oldRule.thresholdHoursADay); // jshint ignore:line
    for (j = 0; j < oldRule.strings.length; j++) {
      ruleDesc.addStringCode(oldRule.strings[j].string, oldRule.strings[j].desc, oldRule.strings[j].code);
    }
    if (oldRule.countries !== undefined) {
      for (j = 0; j < oldRule.countries.length; j++) {
        ruleDesc.countries.push(oldRule.countries[j]);
      }
    }
    return ruleDesc;
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
