'use strict';

var usEnglishCode = 'en_US';

function Language(desc, code) {
  this.code = code;
  this.desc = desc;
  this.description = function() {
    return this.desc + ' [' + this.code + ']';
  };
}

angular.module('LanguagesService', []).service('Languages', function () {
  var languages = [
    new Language('English US', usEnglishCode),
    new Language('English (ROW)', 'en'),
    new Language('French (ROW)', 'fr'),
    new Language('French Canadian', 'fr_CA'),
    new Language('German', 'de'),
    new Language('Spanish', 'es'),
    new Language('Portuguese', 'pt')
  ];

  this.getLanguages = function () {
    return languages;
  };
  this.findLanguage = function (code) {
    for (var i = 0; i < languages.length; i++) {
      if (languages[i].code === code) {
        return languages[i];
      }
    }
    return undefined;
  };
  this.getDefaultLanguage = function() {
    return languages[0];
  };
});
