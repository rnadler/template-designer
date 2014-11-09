'use strict';

describe('filters: range', function() {

  beforeEach(module('rangeFilters'));

  describe('range', function() {

    it('should return array of range size',
      inject(function(rangeFilter) {
        expect(rangeFilter(4).length).toBe(4);
        expect(rangeFilter(10).length).toBe(10);
      }));
  });
});
