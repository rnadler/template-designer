'use strict';

describe('services: groups', function() {

  beforeEach(module('GroupsService'));

  describe('Groups', function() {

    it('should manage an array of groups',
      inject(function(Groups) {
        expect(Groups.getGroups().length).toBe(8);
        // Remove a group
        expect(Groups.removeGroup('InCompliance')).toBe(7);
        expect(Groups.getGroups().length).toBe(7);
        expect(Groups.removeGroup('GroupNotThere')).toBe(-1);
        // Add a group
        Groups.addGroup('xxxx');
        expect(Groups.getGroups().length).toBe(8);
        expect(Groups.getGroups()[7]).toBe('xxxx');
        // Set groups
        Groups.setGroups(['xxx','yyy'], true);
        expect(Groups.getGroups().length).toBe(3); // adds Blank
        expect(Groups.getGroups()[0]).toBe('--- Blank ---');
        Groups.setGroups(['aaa','bbb', 'yyy'], false);
        expect(Groups.getGroups().length).toBe(5);
        Groups.setGroups(['xxx','yyy','--- Blank ---'], true);
        expect(Groups.getGroups()[0]).toBe('--- Blank ---'); // Blank always on top
      }));
  });
});
