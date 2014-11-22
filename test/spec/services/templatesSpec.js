'use strict';

describe('services: templates', function() {

  beforeEach(module('TemplatesService'));

  describe('Templates', function() {

    it('should manage an array of templates',
      inject(function(Templates) {
        expect(Templates.getTemplates().length).toBe(3);
        expect(Templates.getTemplates()[1].name).toBe('template-3x3');
        // Add a template
        Templates.addTemplate('xxxx', 1, 1);
        expect(Templates.getTemplates().length).toBe(4);
        var template = Templates.getTemplates()[3];
        expect(template.name).toBe('xxxx');
        expect(template.rows).toBe(1);
        expect(template.getColumns()).toBe(1);
        // Remove a template
        expect(Templates.removeTemplate(template)).toBe(3);
        expect(Templates.getTemplates().length).toBe(3);
        expect(Templates.removeTemplate(new Template('yyy', 2, 2))).toBe(-1);
        // Test UpdateGroupName remove
        var template_grid = Templates.getTemplates()[0].grid;
        template_grid.setCell(0,0,'cell00','#000000');
        expect(template_grid.getCell(0,0).name).toBe('cell00');
        expect(template_grid.getCell(0,0).color).toBe('#000000');
        Templates.updateGroupName('cell00', '');
        expect(template_grid.getCell(0,0).name).toBe('--- Blank ---');
        expect(template_grid.getCell(0,0).color).toBe('#000000'); // color unchanged
        // Test UpdateGroupName rename
        template_grid.setCell(2,2,'cell22','');
        expect(template_grid.getCell(2,2).name).toBe('cell22');
        Templates.updateGroupName('cell22', 'xxxcell22xxx');
        expect(template_grid.getCell(2,2).name).toBe('xxxcell22xxx');
      }));
  });
});
