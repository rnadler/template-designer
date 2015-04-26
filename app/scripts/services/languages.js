'use strict';

var usEnglishCode = 'en_US';

var Language = Class.create(CodedItem, { // jshint ignore:line
  initialize: function($super, desc, code) {
    $super(desc, code);
  }
});

angular.module('LanguagesService', []).service('Languages', function () {
  var languageList = new CodedItemList(); // jshint ignore:line
  languageList
    .addItem(new Language('English US', usEnglishCode))
    .addItem(new Language('English (ROW)', 'en'))
    .addItem(new Language('French (ROW)', 'fr'))
    .addItem(new Language('French Canadian', 'fr_CA'))
    .addItem(new Language('German', 'de'))
    .addItem(new Language('Spanish', 'es'))
    .addItem(new Language('Portuguese', 'pt'));

  this.getLanguages = function () {
    return languageList.getList();
  };
  this.findLanguage = function (code) {
    return languageList.findItem(code);
  };
  this.getDefaultLanguage = function() {
    return languageList.getList()[0];
  };
});
