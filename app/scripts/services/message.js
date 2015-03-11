'use strict';

function LanguageString(string, code) {
  this.string = string;
  this.code = code;
}

var Message = Class.create({ // jshint ignore:line
  initialize: function(name, englishString) {
    this.name = name;
    this.strings = [
      new LanguageString(englishString !== undefined ? englishString : name, usEnglishCode) // jshint ignore:line
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
  addString: function(string, language) {
    var existing = this.getLanguageString(language);
    if (existing !== undefined) {
      this.strings.splice(this.strings.indexOf(existing),1);
    }
    this.strings.push(new LanguageString(string, language.code));
  },
  addStringCode: function(string, languageCode) {
    this.addString(string, new Language(null, languageCode)); // jshint ignore:line
  }
});
