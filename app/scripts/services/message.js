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
  }
});
