'use strict';


describe('services: complianceRules', function() {

  beforeEach(module('ComplianceRulesService', 'LanguagesService'));

  describe('Rules', function() {

    it('should manage an array of compliance rules',
      inject(function(ComplianceRules, Languages) {
        var g = function(name) {
            return new RuleDesc(name); // jshint ignore:line
          },
          find = function(name) {
            return ComplianceRules.findRule(name);
          },
          defaultLanguage = Languages.getDefaultLanguage(),
          ruleTypes = ComplianceRules.getRuleTypes();

        expect(ComplianceRules.getRules().length).toBe(3);
        // Remove a rule
        expect(ComplianceRules.removeRule(g('RuleNotThere'))).toBe(-1);
        expect(ComplianceRules.removeRule(find('cms'))).toBe(0);
        expect(ComplianceRules.getRules().length).toBe(2);
        expect(ComplianceRules.removeRule(g('rolling'))).toBe(-1); // can't remove last rule

        // Add a rule
        ComplianceRules.addRule(g('xxxx'));
        expect(ComplianceRules.getRules().length).toBe(3);
        expect(ComplianceRules.getRules()[2].name).toBe('xxxx');
        expect(ComplianceRules.getRules()[2].ruleType).toBe('initial');
        expect(ComplianceRules.getRules()[2].getString(defaultLanguage)).toBe('xxxx');
        // Set rules
        ComplianceRules.setRules([g('xxx'),g('yyy')], true);
        expect(ComplianceRules.getRules().length).toBe(2);
        ComplianceRules.setRules([g('aaa'),g('bbb'), g('yyy')], false);
        expect(ComplianceRules.getRules().length).toBe(4);

        // Rule types
        expect(ruleTypes.length).toBe(2);
        expect(ruleTypes[0]).toBe('initial');
      }));
  });
});
