'use strict';

var usCountryCode = 'us';

var Country = Class.create(CodedItem, { // jshint ignore:line
  initialize: function($super, desc, code) {
    $super(desc, code);
  }
});

angular.module('CountriesService', []).service('Countries', function () {
  var countryList = new CodedItemList(); // jshint ignore:line

  this.setCountries = function(countries) {
    return countryList.setItems(countries);
  };

  this.getCountries = function () {
    return countryList.getList();
  };
  this.findCountry = function (code) {
    return countryList.findItem(code);
  };
  this.getDefaultCountry = function() {
    return countryList.findItem(usCountryCode);
  };
  this.queryCountries = function(query) {
    return countryList.queryItemByCode(query);

  };
  this.getCountriesFromCodes = function(codes) {
    return countryList.getItemsFromCodes(codes);
  };
});
