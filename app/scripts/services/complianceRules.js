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
    this.windowDays = windowDays === undefined ? 30 : windowDays;
    this.thresholdDays = thresholdDays;
    this.thresholdHoursADay = thresholdHoursADay === undefined  ? 4 : thresholdHoursADay;
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
  this.findCountry = function(allCountries, desc) {
    if (!desc || desc.length === 0) {
      return undefined;
    }
    if (desc === 'US') {
      desc = 'United States';
    }
    for (var i = 0; i < allCountries.length; i++) {
      if (allCountries[i].desc === desc) {
        return allCountries[i];
      }
    }
    console.error('Unable to find country for ' + desc);
    return undefined;
  };
  this.extractCountries = function(countryText, allCountries) {
    if (countryText === undefined) {
      return [];
    }
    var countries = countryText.split(/,/);
    if (countries === null) {
      return [];
    }
    var i,rv = [];
    for (i = 0; i < countries.length; i++) {
      var country = this.findCountry(allCountries, countries[i].trim());
      if (country !== undefined) {
        rv.push(country);
      }
    }
    return rv;
  };
  this.extractIntValue = function(name, regex) {
    var val = name.match(regex);
    if (val === null || val.length !== 2) {
      return undefined;
    }
    return parseInt(val[1]);
  };
  this.addFromText = function (tokens, ruleMap, allCountries) {
    var id = tokens[ruleMap[0]],
      ruleName = tokens[ruleMap[1]],
      type = tokens[ruleMap[2]].toLowerCase(),
      hours = this.extractIntValue(ruleName, /(\d+) hours/i),
      windowDays = this.extractIntValue(ruleName, /(\d+) consecutive day/i),
      windowWeeks = this.extractIntValue(ruleName, /(\d+) consecutive week/i),
      months = this.extractIntValue(ruleName, /(\d+) month/i),
      years = this.extractIntValue(ruleName, /(\d+) year/i),
      weeks = this.extractIntValue(ruleName, /(\d+) week/i),
      rangeDays = this.extractIntValue(ruleName, /(\d+) day/i),
      countries = this.extractCountries(tokens[ruleMap[5]], allCountries);
    if (hours === undefined) {
      console.error('Failed to find hours in ' + ruleName);
      return false;
    }
    if (windowDays === undefined) {
      if (windowWeeks !== undefined) {
        windowDays = windowWeeks * 7;
      }
      if (months !== undefined) {
        windowDays = months * 30;
      }
      if (years !== undefined) {
        windowDays = years * 365;
      }
    }
    if (windowDays === undefined && rangeDays === undefined) {
      console.error('Failed to find range/window days in ' + ruleName);
      return false;
    }
    if (windowDays === undefined) {
      windowDays = rangeDays;
    }
    if (rangeDays === undefined) {
      if (weeks !== undefined) {
        rangeDays = weeks * 7;
      } else {
        rangeDays = windowDays;
      }
    }
    if (type === 'ongoing') {
      rangeDays = undefined;
    }
    if (this.addRule(new RuleDesc(id, ruleName, ruleName, type, // jshint ignore:line
        countries, rangeDays, windowDays, undefined, hours)) === -1) {
      return false;
    } else {
      return true;
    }
  };
});
