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
    if (name === blank) {
      this.clearCell(row, col);
      return;
    }
    this.cells[this.ordinal(row, col)] = new Cell(name, color);
  },

  clearCell: function(row, col) {
    delete this.cells[this.ordinal(row, col)];
  },

  getCell: function (row, col) {
    var rv = this.cells[this.ordinal(row, col)];
    return (rv === undefined) ? blankCell : rv;
  }
};
