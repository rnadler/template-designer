'use strict';

function LanguageString(string, desc, code) {
  this.string = string;
  this.desc = desc;
  this.code = code;
}

var Message = Class.create({ // jshint ignore:line
  initialize: function(name, englishString, englishDesc) {
    this.name = name;
    this.strings = [
      new LanguageString(englishString !== undefined ? englishString : name, englishDesc, usEnglishCode) // jshint ignore:line
    ];
  },
  getLanguageString: function(language) {
    for (var i = 0; i < this.strings.length; i++) {
      var languageString = this.strings[i];
      if (language !== undefined && languageString.code === language.code) {
        return languageString;
      }
    }
    return undefined;
  },
  getString: function(language) {
    var languageString = this.getLanguageString(language);
    return languageString === undefined ? this.name : languageString.string;
  },
  getDesc: function(language) {
    var languageString = this.getLanguageString(language);
    return languageString === undefined ? this.name : languageString.desc;
  },
  addString: function(name, desc, language) {
    var existing = this.getLanguageString(language);
    if (existing !== undefined) {
      this.strings.splice(this.strings.indexOf(existing),1);
    }
    this.strings.push(new LanguageString(name, desc, language.code));
  },
  addStringCode: function(string, desc, languageCode) {
    this.addString(string, desc, new Language(null, languageCode)); // jshint ignore:line
  },
  translateDescToLanguage: function($http, language) {
    var self = this;
    $http(
      { url: 'http://api.mymemory.translated.net/get',
        method: 'GET',
        params:{
          q: self.getDesc(new Language(null, usEnglishCode)), // jshint ignore:line
          langpair: 'en|' + language.code.substring(0, 2)
      }}).
      success(function (data) {
        if (data.matches.length > 0) {
          self.addString(self.getString(language), data.matches[0].translation, language);
        } else {
          console.error(data);
        }
      });
  }
});
