'use strict';


describe('services: complianceRules', function() {

  beforeEach(module('ComplianceRulesService'));

  describe('Rules', function() {
    var defaultLanguage = new Language(null, 'en_US'), // jshint ignore:line
        map = [5, 6, 2, 0, 1, 3, 4],
        testRule = function(rule, id, name, desc, type, countries, rangeDays, windowDays, threshold) {
          expect(rule.name).toBe(id);
          expect(rule.ruleType).toBe(type);
          expect(rule.getString(defaultLanguage)).toBe(name);
          expect(rule.getDesc(defaultLanguage)).toBe(desc);
          expect(rule.countries.length).toBe(countries.length);
          expect(rule.rangeDays).toBe(rangeDays);
          expect(rule.windowDays).toBe(windowDays);
          //expect(rule.thresholdDays).toBe(undefined);
          expect(rule.thresholdHoursADay).toBe(threshold);
        },
        getTokens = function(line) {
          var tokens = line.split(/\t|;|:/);
          expect(tokens.length).toBe(map.length);
          return tokens;
        },
        testText = function(ComplianceRules, line, id, name, desc, type, countries, rangeDays, windowDays, threshold) {
          var tokens = getTokens(line);
          expect(ComplianceRules.getRules().length).toBe(3);
          expect(ComplianceRules.addFromText(tokens, map)).toBe(true);
          expect(ComplianceRules.getRules().length).toBe(4);
          testRule(ComplianceRules.getRules()[3], id, name, desc, type, countries, rangeDays, windowDays, threshold);
        };
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
        testRule(ComplianceRules.getRules()[2], 'xxxx', 'xxxx', undefined, 'initial', [], 90, 30, 4);
        expect(ComplianceRules.getRules()[2].thresholdDays).toBe(21);

        // Test defaults
        ComplianceRules.addRule(new RuleDesc('default')); // jshint ignore:line
        testRule(ComplianceRules.getRules()[3], 'default', 'default', undefined, 'initial', [], undefined, 30, 4);
        // Set rules
        ComplianceRules.setRules([g('xxx'),g('yyy')], true);
        expect(ComplianceRules.getRules().length).toBe(2);
        ComplianceRules.setRules([g('aaa'),g('bbb'), g('yyy')], false);
        expect(ComplianceRules.getRules().length).toBe(4);

        // Rule types
        expect(ruleTypes.length).toBe(2);
        expect(ruleTypes[0]).toBe('initial');
      }));

    it('should extract US initial rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Usage >= 5 hours for  21 out of 30 consecutive days within a 90 day period	Usage >= X hours for Y days within a Z day period	Initial	US, Canada	Yes	US_UsageEquOver5HoursOver21of30In90DaysInitial	Usage >= 5 hours for 21 out of 30 consecutive days within a 90 day period',
            name = 'Usage >= 5 hours for 21 out of 30 consecutive days within a 90 day period',
            id = 'US_UsageEquOver5HoursOver21of30In90DaysInitial';
        testText(ComplianceRules, line, id, name, name, 'initial', [], 90, 30, 5);
      }));
    it('should extract US ongoing rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Usage >= 4 hours for 70% of the days between 60 to 90 of a 90 day period	Usage >= X hours for Y% of the days between day Z and W of a T day period	Ongoing	US, Canada		US_UsageEquOver4HoursBetween60To90DaysIn90DaysOngoing	Usage >= 4 hours for 70% of the days between 60 to 90 of a 90 day period',
          name = 'Usage >= 4 hours for 70% of the days between 60 to 90 of a 90 day period',
          id = 'US_UsageEquOver4HoursBetween60To90DaysIn90DaysOngoing';
        testText(ComplianceRules, line, id, name, name, 'ongoing', [], undefined, 90, 4);
      }));
    it('should extract EU initial rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Average of 4 hours usage over 1 months (30 days)	The usage over a certain span X is >= Y	Initial	Finland, Switzerland, France		EU_AverageEquOver4HoursOver30DaysInitial	Average of 4 hours usage over 1 month',
          name = 'Average of 4 hours usage over 1 month',
          id = 'EU_AverageEquOver4HoursOver30DaysInitial';
        testText(ComplianceRules, line, id, name, name, 'initial', [], 30, 30, 4);
      }));
    it('should extract EU ongoing rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'The sum of usage is >= 84 within a 28 day span AND  20 days are >= 3 hours within a 28 day span 	The sum of usage is >= 84 within a 28 day span AND  20 days are >= 3 hours within a 28 day span 	Ongoing	France, Benelux	Yes	EU_UsageEquOver3HoursOver20Of28DaysAndSummaryEquOver84HoursOver28DaysOnGoing	The sum of usage is >= 84 within a 28 day span AND  20 days are >= 3 hours within a 28 day span',
          name = 'The sum of usage is >= 84 within a 28 day span AND  20 days are >= 3 hours within a 28 day span',
          id = 'EU_UsageEquOver3HoursOver20Of28DaysAndSummaryEquOver84HoursOver28DaysOnGoing';
        testText(ComplianceRules, line, id, name, name, 'ongoing', [], undefined, 28, 3);
      }));
    it('should extract EU ongoing with years rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Average of 3 hours usage over 1 year (365 days)	The usage over a certain span X is >= Y	Ongoing	Spain		EU_AverageEquOver3HoursOver365DaysOnGoing	Average of 3 hours usage over 1 year',
          name = 'Average of 3 hours usage over 1 year',
          id = 'EU_AverageEquOver3HoursOver365DaysOnGoing';
        testText(ComplianceRules, line, id, name, name, 'ongoing', [], undefined, 365, 3);
      }));
    it('should extract EU ongoing with weeks rule from text',
      inject(function(ComplianceRules) { // jshint ignore:line
        var line = 'Usage >= 4 hours for 70% of the days in 4 consecutive weeks(28 days) in a 12 week period (84 days)	Usage >= X hours for Y% of the days in Z day period between days P and Q	Ongoing	Australia		AU_UsageEquOver4HoursOver20of28In84DaysOngoing	Usage >= 4 hours for 70% of the days in 4 consecutive weeks in a 12 week period',
          name = 'Usage >= 4 hours for 70% of the days in 4 consecutive weeks in a 12 week period',
          id = 'AU_UsageEquOver4HoursOver20of28In84DaysOngoing';
        testText(ComplianceRules, line, id, name, name, 'ongoing', [], undefined, 28, 4);
      }));
  });
});
