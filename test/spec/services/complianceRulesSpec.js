'use strict';


describe('services: complianceRules', function() {

  beforeEach(module('ComplianceRulesService'));

  describe('Rules', function() {
    var defaultLanguage = new Language(null, 'en_US'); // jshint ignore:line
    it('should manage an array of compliance rules',
      inject(function(ComplianceRules) { // jshint ignore:line
        var g = function(name) {
            return new RuleDesc(name, undefined, undefined, RuleType.INITIAL, [], 90, 30, 21, 4); // jshint ignore:line
          },
          find = function(name) {
            return ComplianceRules.findRule(name);
          },
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
        expect(ComplianceRules.getRules()[2].rangeDays).toBe(90);
        expect(ComplianceRules.getRules()[2].windowDays).toBe(30);
        expect(ComplianceRules.getRules()[2].thresholdDays).toBe(21);
        expect(ComplianceRules.getRules()[2].thresholdHoursADay).toBe(4);
        // Test defaults
        ComplianceRules.addRule(new RuleDesc('default')); // jshint ignore:line
        expect(ComplianceRules.getRules().length).toBe(4);
        expect(ComplianceRules.getRules()[3].name).toBe('default');
        expect(ComplianceRules.getRules()[3].ruleType).toBe('initial');
        expect(ComplianceRules.getRules()[3].getString(defaultLanguage)).toBe('default');
        expect(ComplianceRules.getRules()[3].rangeDays).toBe(undefined);
        expect(ComplianceRules.getRules()[3].windowDays).toBe(30);
        expect(ComplianceRules.getRules()[3].thresholdDays).toBe(undefined);
        expect(ComplianceRules.getRules()[3].thresholdHoursADay).toBe(4);
        // Set rules
        ComplianceRules.setRules([g('xxx'),g('yyy')], true);
        expect(ComplianceRules.getRules().length).toBe(2);
        ComplianceRules.setRules([g('aaa'),g('bbb'), g('yyy')], false);
        expect(ComplianceRules.getRules().length).toBe(4);

        // Rule types
        expect(ruleTypes.length).toBe(2);
        expect(ruleTypes[0]).toBe('initial');
      }));

    it('should extract rules from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Usage >= 5 hours for  21 out of 30 consecutive days within a 90 day period	Usage >= X hours for Y days within a Z day period	Initial	US, Canada	Yes	US_UsageEquOver5HoursOver21of30In90DaysInitial	Usage >= 5 hours for 21 out of 30 consecutive days within a 90 day period',
            tokens = line.split(/\t|;|:/),
            map = [5, 6, 2, 0, 1, 3, 4],
            name = 'Usage >= 5 hours for 21 out of 30 consecutive days within a 90 day period';

        expect(tokens.length).toBe(map.length);
        expect(ComplianceRules.getRules().length).toBe(3);

        expect(ComplianceRules.addFromText(tokens, map)).toBe(true);
        expect(ComplianceRules.getRules().length).toBe(4);

        expect(ComplianceRules.getRules()[3].name).toBe('US_UsageEquOver5HoursOver21of30In90DaysInitial');
        expect(ComplianceRules.getRules()[3].ruleType).toBe('initial');
        expect(ComplianceRules.getRules()[3].getString(defaultLanguage)).toBe(name);
        expect(ComplianceRules.getRules()[3].getDesc(defaultLanguage)).toBe(name);
        expect(ComplianceRules.getRules()[3].countries.length).toBe(0);
        expect(ComplianceRules.getRules()[3].rangeDays).toBe(undefined);
        expect(ComplianceRules.getRules()[3].windowDays).toBe(30);
        expect(ComplianceRules.getRules()[3].thresholdDays).toBe(undefined);
        expect(ComplianceRules.getRules()[3].thresholdHoursADay).toBe(5);
      }));
  });
});
