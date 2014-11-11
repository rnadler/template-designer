'use strict';

function Grid(columns) {
  this.columns = columns;
  this.cells = {};
}
Grid.prototype = {

  ordinal: function (row, col) {
    return (row * this.columns) + col;
  },

  set: function (row, col, val) {
    this.cells[this.ordinal(row, col)] = val;
  },

  get: function (row, col) {
    var rv = this.cells[this.ordinal(row, col)];
    return rv === undefined ? 'None' : rv;
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
  this.addTemplate = function(template) {
    templates.push(template);
  };
});
