'use strict';

var usCountryCode = 'us';

var Country = Class.create(CodedItem, { // jshint ignore:line
  initialize: function($super, desc, code) {
    $super(desc, code);
  }
});

angular.module('CountriesService', []).service('Countries', function () {
  var countryList = new CodedItemList(); // jshint ignore:line
  countryList
    .addItem(new Country('United States', usCountryCode))
    .addItem(new Country('Canada', 'ca'))
    .addItem(new Country('Australia', 'au'))
    .addItem(new Country('France', 'fr'))
    .addItem(new Country('Germany', 'de'))
    .addItem(new Country('Spain', 'es'))
    .addItem(new Country('British Isles', 'bi'))
    .addItem(new Country('Finland', 'fi'))
    .addItem(new Country('Sweden', 'se'))
    .addItem(new Country('Switzerland', 'ch'))
    .addItem(new Country('Italy', 'it'))
    .addItem(new Country('Benelux', 'bnl'))
    .addItem(new Country('Norway', 'no'))
    .addItem(new Country('Denmark', 'dk'));

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
});
