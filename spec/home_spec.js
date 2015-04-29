describe('template designer homepage', function() {
  'use strict';

  beforeEach(function () {
    browser.get('http://localhost:9000/#/');
    browser.waitForAngular();
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Template Designer');
  });

  it('should have tabs with correct headings', function() {
    expect(element(by.id('project')).getText()).toEqual('Project []');
    expect(element(by.id('groups')).getText()).toEqual('Rule Groups [12]');
    expect(element(by.id('rules')).getText()).toEqual('Compliance Rules [3]');
    expect(element(by.id('templates')).getText()).toEqual('Templates [2]');
    expect(element(by.id('language')).getText()).toEqual('English US [en_US]');
    expect(element(by.id('actionview')).getText()).toEqual('Action View');
  });

  it('should have language selections', function() {
    expect(element(by.id('language')).getText()).toEqual('English US [en_US]');
    expect(element.all(by.repeater('l in languages')).count()).toEqual(7);
  });
});
