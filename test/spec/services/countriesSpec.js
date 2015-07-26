'use strict';

var countries = [
  {
    code: 'au',
    desc: 'Australia'
  },
  {
    code: 'bnl',
    desc: 'Benelux'
  },
  {
    code: 'bi',
    desc: 'British Isles'
  },
  {
    code: 'ca',
    desc: 'Canada'
  },
  {
    code: 'dk',
    desc: 'Denmark'
  },
  {
    code: 'fi',
    desc: 'Finland'
  },
  {
    code: 'fr',
    desc: 'France'
  },
  {
    code: 'de',
    desc: 'Germany'
  },
  {
    code: 'it',
    desc: 'Italy'
  },
  {
    code: 'no',
    desc: 'Norway'
  },
  {
    code: 'pt',
    desc: 'Portugal'
  },
  {
    code: 'es',
    desc: 'Spain'
  },
  {
    code: 'se',
    desc: 'Sweden'
  },
  {
    code: 'ch',
    desc: 'Switzerland'
  },
  {
    code: 'us',
    desc: 'United States'
  }
];

describe('services: countries', function () {

  beforeEach(module('CountriesService'));

  describe('Countries', function () {

    it('should manage an array of countries',
      inject(function (Countries) {
        Countries.setCountries(countries);
        expect(Countries.getCountries().length).toBe(15);
        expect(Countries.getDefaultCountry().code).toBe('us');
        // Find a country by code
        expect(Countries.findCountry('es').description()).toBe('Spain [es]');
        expect(Countries.findCountry('xx')).toBe(undefined);
        // List from codes
        var list = Countries.getCountriesFromCodes(['us', 'fr','xx']);
        expect(list.length).toBe(3);
        expect(list[1].code).toBe('fr');
        expect(list[2]).toBe(undefined);
        // Query
        expect(Countries.queryCountries().length).toBe(15);
        expect(Countries.queryCountries('').length).toBe(15);
        expect(Countries.queryCountries('d').length).toBe(2);
      }));
  });
});
