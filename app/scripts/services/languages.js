'use strict';

var usEnglishCode = 'en_US'; // jshint ignore:line

var Language = Class.create(CodedItem, { // jshint ignore:line
  initialize: function($super, desc, code) {
    $super(desc, code);
  }
});

angular.module('LanguagesService', []).service('Languages', function () {
  var languageList = new CodedItemList(); // jshint ignore:line

  this.setLanguages = function(languages) {
    return languageList.setItems(languages);
  };
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
