'use strict';


describe('services: groups', function() {

  beforeEach(module('GroupsService'));

  describe('Groups', function() {

    it('should manage an array of groups',
      inject(function(Groups) {
        var g = function(name) {
          return new Group(name, name); // jshint ignore:line
        };

        var find = function(name) {
          return Groups.findGroup(name);
        };
        expect(Groups.getGroups().length).toBe(8);
        // Remove a group
        expect(Groups.removeGroup(find('InCompliance'))).toBe(7);
        expect(Groups.getGroups().length).toBe(7);
        expect(Groups.removeGroup(g('GroupNotThere'))).toBe(-1);
        // Add a group
        Groups.addGroup(g('xxxx'));
        expect(Groups.getGroups().length).toBe(8);
        expect(Groups.getGroups()[7].name).toBe('xxxx');
        expect(Groups.getGroups()[7].desc).toBe('xxxx');
        // Set groups
        Groups.setGroups([g('xxx'),g('yyy')], true);
        expect(Groups.getGroups().length).toBe(3); // adds Blank
        expect(Groups.getGroups()[0].name).toBe('--- Blank ---');
        Groups.setGroups([g('aaa'),g('bbb'), g('yyy')], false);
        expect(Groups.getGroups().length).toBe(5);
        Groups.setGroups([g('xxx'),g('yyy'),g('--- Blank ---')], true);
        expect(Groups.getGroups()[0].name).toBe('--- Blank ---'); // Blank always on top
      }));
  });
});
