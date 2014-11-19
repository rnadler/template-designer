'use strict';

var blank = '--- Blank ---';

function Cell(name, color) {
  this.name = name;
  this.color = color;
}
var blankCell = new Cell(blank, '#ffffff');

function Grid(columns) {
  this.columns = columns;
  this.cells = {};
}
Grid.prototype = {

  ordinal: function (row, col) {
    return (row * this.columns) + col;
  },

  setCell: function (row, col, name, color) {
    this.cells[this.ordinal(row, col)] = new Cell(name, color);
  },

  getCell: function (row, col) {
    var rv = this.cells[this.ordinal(row, col)];
    return (rv === undefined) ? blankCell : rv;
  }
};

function Template(name, rows, columns) {
  this.name = name;
  this.rows = rows;
  this.grid = new Grid(columns);
}
Template.prototype = {

  getColumns: function () {
    return this.grid.columns;
  },

  setColumns: function (columns) {
    this.grid.columns = columns;
  }
};

angular.module('TemplatesService', []).service('Templates', function () {
  var templates = [
    new Template('template-4x4', 4, 4),
    new Template('template-3x3', 3, 3),
    new Template('template-2x2', 2, 2)
  ];
  this.getTemplates = function () {
      return templates;
  };
  this.setTemplates = function (tmplts) {
    // The JSON version of the Template object needs to be reconstituted to include the prototypes.
    // There's probably a better way to do this, but this works for now...
    templates = [];
    for (var t in tmplts) {
      var temp = tmplts[t];
      var grid = temp.grid;
      var nt = new Template(temp.name, temp.rows, grid.columns);
      for (var c in grid.cells) {
        var cell = grid.cells[c];
        nt.grid.cells[c] = new Cell(cell.name, cell.color);
      }
      templates.push(nt);
    }
    return templates;
  };
  this.addTemplate = function(templateName, rows, columns) {
    templates.push(new Template(templateName, rows, columns));
  };
  this.removeTemplate = function(template) {
    var index = templates.indexOf(template);
    if (index > -1) {
      templates.splice(index, 1);
    }
    return index;
  };
  // Update cells with group name changes
  this.updateGroupName = function(oldGroup, newGroup) {
    for (var t in templates) {
      var temp = templates[t];
      var grid = temp.grid;
      for (var c in grid.cells) {
        var cell = grid.cells[c];
        if (cell.name == oldGroup) {
          cell.name = newGroup == '' ? blank : newGroup;
        }
      }
    }
  }
});
