'use strict';

describe('services: languages', function () {

  beforeEach(module('LanguagesService'));

  describe('Languages', function () {

    it('should manage an array of languages',
      inject(function (Languages) {

        expect(Languages.getLanguages().length).toBe(7);
        expect(Languages.getDefaultLanguage().code).toBe('en_US');
        // Find a language by code
        expect(Languages.findLanguage('es').description()).toBe('Spanish [es]');
        expect(Languages.findLanguage('de_DE')).toBe(undefined);
      }));

    it('should define a Message object',
      inject(function (Languages) {
          var message = new Message('message', 'english message'), // jshint ignore:line
              spanish = Languages.findLanguage('es'),
              german = Languages.findLanguage('de'),
              defaultLanguage = Languages.getDefaultLanguage();

          expect(message.getString(defaultLanguage)).toBe('english message');
          message.addString('mensaje de Inglés', spanish);
          expect(message.strings.length).toBe(2);
          expect(message.getString(spanish)).toBe('mensaje de Inglés');
          message.addString('mensaje de Inglés 2', spanish);
          expect(message.strings.length).toBe(2);
          expect(message.getString(spanish)).toBe('mensaje de Inglés 2');
          message.addString('english message--2', defaultLanguage);
          expect(message.strings.length).toBe(2);
          expect(message.getString(german)).toBe('message');
          message.addStringCode('Englisch Nachricht', 'de');
          expect(message.strings.length).toBe(3);
          expect(message.getString(german)).toBe('Englisch Nachricht');
        }
      ));
  });
});
