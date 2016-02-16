describe('template designer compliance rules page', function() {
  'use strict';

  beforeEach(function () {
    browser.get('http://localhost:9000/#/');
    browser.waitForAngular();
    element(by.id('rules')).click();
  });

  it('should have an add complinace rule button', function() {
    expect(element(by.id('addcompliancerule')).getText()).toEqual('Add a Compliance Rule');
  });

  it('should have compliance rules', function() {
    expect(element.all(by.className('ui-grid-row')).count()).toEqual(3);
  });
});
