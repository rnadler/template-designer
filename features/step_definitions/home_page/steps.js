var support = require('../support');

var steps = function() {

  this.Given(/^I am on the homepage$/, function(callback) {
    support.get(this, 'http://localhost:9000/#/', function(result) {
      setTimeout(callback, 3000);
    });
  });

  this.Then(/^I should see the title be "([^"]*)"$/, function(title, callback) {
    support.findById(this, 'title', function(result){
      result.getText().then (function(text){
        text.should.equal(title);
        setTimeout(callback, 1000);
      });
    });
  });
  this.Then(/^I should see a "([^"]*)" link$/, function(link, callback) {
    support.findByBinding(this, link, function(result){
      result.getText().then (function(text){
        text.trim().toLowerCase().should.equal(link.trim().toLowerCase());
        setTimeout(callback, 1000);
      });
    });
  });

  this.Then(/^I should not see a "([^"]*)" link$/, function(link, callback) {
    support.isElementPresent(this, link, function(result){
      result.should.equal(false);
      setTimeout(callback, 1000);
    });
  });

  this.Then(/^I should see a "([^"]*)"$/, function(link, callback) {
    support.isElementPresentByClass(this, link, function(result){
      result.should.equal(true);
      setTimeout(callback, 1000);
    });
  });

  this.Then(/^I should see a "([^"]*)" tab with heading "([^"]*)"$/, function(link, txt, callback) {
    support.findById(this, link, function(result){
      result.getText().then (function(text){
        text.should.equal(txt);
        setTimeout(callback, 1000);
      });
    });
  });
};

module.exports = steps;
