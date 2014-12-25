'use strict';

describe('services: languages', function() {

  beforeEach(module('LanguagesService'));

  describe('Languages', function() {

    it('should manage an array of languages',
      inject(function(Languages) {

        expect(Languages.getLanguages().length).toBe(7);
        expect(Languages.getLanguages()[0].code).toBe('en_US');
        // Find a language by code
        expect(Languages.findLanguage('es').description()).toBe('Spanish [es]');
        expect(Languages.findLanguage('de_DE')).toBe(undefined);
      }));
  });
});
