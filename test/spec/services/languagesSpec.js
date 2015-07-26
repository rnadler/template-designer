'use strict';

var languages = [
    {
      code: 'en_US',
      desc: 'English US'
    },
    {
      code: 'en',
      desc: 'English (ROW)'
    },
    {
      code: 'fr',
      desc: 'French (ROW)'
    },
    {
      code: 'fr_CA',
      desc: 'French Canadian'
    },
    {
      code: 'de',
      desc: 'German'
    },
    {
      code: 'es',
      desc: 'Spanish'
    },
    {
      code: 'pt',
      desc: 'Portuguese'
    }
  ];

describe('services: languages', function () {

  beforeEach(module('LanguagesService'));

  describe('Languages', function () {

    it('should manage an array of languages',
      inject(function (Languages) {
        Languages.setLanguages(languages);
        expect(Languages.getLanguages().length).toBe(7);
        expect(Languages.getDefaultLanguage().code).toBe('en_US');
        // Find a language by code
        expect(Languages.findLanguage('es').description()).toBe('Spanish [es]');
        expect(Languages.findLanguage('de_DE')).toBe(undefined);
      }));

    it('should define a Message object',
      inject(function (Languages) {
          Languages.setLanguages(languages);
          var message = new Message('message', 'english message'), // jshint ignore:line
              spanish = Languages.findLanguage('es'),
              german = Languages.findLanguage('de'),
              defaultLanguage = Languages.getDefaultLanguage(),
              addStringToMessage = function(name, lang) {
                message.addString(name, name + ' desc', lang);
          };

          expect(message.getString(defaultLanguage)).toBe('english message');
          addStringToMessage('mensaje de Inglés', spanish);
          expect(message.strings.length).toBe(2);
          expect(message.getString(spanish)).toBe('mensaje de Inglés');
          addStringToMessage('mensaje de Inglés 2', spanish);
          expect(message.strings.length).toBe(2);
          expect(message.getString(spanish)).toBe('mensaje de Inglés 2');
          addStringToMessage('english message--2', defaultLanguage);
          expect(message.strings.length).toBe(2);
          expect(message.getString(german)).toBe('message');
          message.addStringCode('Englisch Nachricht', 'Englisch Nachricht desc', 'de');
          expect(message.strings.length).toBe(3);
          expect(message.getString(german)).toBe('Englisch Nachricht');
          expect(message.getDesc(german)).toBe('Englisch Nachricht desc');
        }
      ));
  });
});
