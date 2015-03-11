'use strict';

describe('services: templates', function() {

  beforeEach(module('TemplatesService'));

  describe('Templates', function() {

    it('should manage an array of templates',
      inject(function(Templates) {
        var getT = function(n) {
              return Templates.getTemplates()[n];
            },
            templateGrid = getT(0).grid;
        expect(Templates.getTemplates().length).toBe(3);
        expect(getT(1).getName()).toBe('template-3x3');
        // Add a template
        Templates.addTemplate('xxxx', 1, 1);
        expect(Templates.getTemplates().length).toBe(4);
        var template = getT(3);
        expect(template.getName()).toBe('xxxx');
        expect(template.rows).toBe(1);
        expect(template.getColumns()).toBe(1);
        // Remove a template
        expect(Templates.removeTemplate(template)).toBe(3);
        expect(Templates.getTemplates().length).toBe(3);
        expect(Templates.removeTemplate(new Template(new Message('yyy'), 2, 2))).toBe(-1); // jshint ignore:line
        // Test UpdateGroupName remove
        templateGrid.setCell(0,0,'cell00','#000000');
        expect(templateGrid.getCell(0,0).name).toBe('cell00');
        expect(templateGrid.getCell(0,0).color).toBe('#000000');
        Templates.updateGroupName('cell00', '');
        expect(templateGrid.getCell(0,0).name).toBe('--- Blank ---');
        expect(templateGrid.getCell(0,0).color).toBe('#000000'); // color unchanged
        // Test UpdateGroupName rename
        templateGrid.setCell(2,2,'cell22','');
        expect(templateGrid.getCell(2,2).name).toBe('cell22');
        Templates.updateGroupName('cell22', 'xxxcell22xxx');
        expect(templateGrid.getCell(2,2).name).toBe('xxxcell22xxx');
        // Set Template
        var templateJson = JSON.stringify(Templates.getTemplates(), null, '\t');
        Templates.removeTemplate(getT(1));
        expect(Templates.getTemplates().length).toBe(2);
        Templates.setTemplates(JSON.parse(templateJson), true);
        expect(Templates.getTemplates().length).toBe(3);
        getT(1).setName(getT(1).getName() + '-xxx'); // rename
        Templates.setTemplates(JSON.parse(templateJson), false);
        expect(Templates.getTemplates().length).toBe(4);
      }));
  });
});
