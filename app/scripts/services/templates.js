'use strict';

var blank = '--- Blank ---';

function Cell(name, color) {
  this.name = name;
  this.color = color;
}

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
    var ordinal = this.ordinal(row, col);
    var rv = this.cells[ordinal];
    if (rv === undefined) {
      this.cells[ordinal] = rv = new Cell(blank, '#ffffff');
    }
    return rv;
  }
};

function Template(name, rows, columns) {
  this.name = name;
  this.rows = rows;
  this.grid = new Grid(columns);
}
Template.prototype = {

  columns: function () {
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
});
