'use strict';

describe('services: countries', function () {

  beforeEach(module('CountriesService'));

  describe('Countries', function () {

    it('should manage an array of countries',
      inject(function (Countries) {

        expect(Countries.getCountries().length).toBe(15);
        expect(Countries.getDefaultCountry().code).toBe('us');
        // Find a country by code
        expect(Countries.findCountry('es').description()).toBe('Spain [es]');
        expect(Countries.findCountry('xx')).toBe(undefined);
      }));
  });
});
