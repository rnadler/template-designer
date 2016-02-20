var pc = require('protractor-cucumber');
var should = require('should');

var steps = function() {
  var seleniumAddress = 'http://localhost:4444/wd/hub';
  var options = { browser : 'chrome', timeout : 100000, assert : should};
  this.World = pc.world(seleniumAddress, options);

  this.After(function(scenario, callback) {
    this.quit(callback);
  });
};

module.exports = steps;
