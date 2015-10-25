'use strict';

var blank = '--- Blank ---';

var CellSize = Object.freeze({
  REGULAR: 'regular',
  LARGE: 'large'
});

function Cell(name, color, size) {
  this.name = name;
  this.color = color;
  this.size = size === undefined ? CellSize.REGULAR : size;
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

  setCell: function (row, col, name, color, size) {
    if (name === blank) {
      this.clearCell(row, col);
      return;
    }
    this.cells[this.ordinal(row, col)] = new Cell(name, color, size);
  },

  clearCell: function(row, col) {
    delete this.cells[this.ordinal(row, col)];
  },

  getCell: function (row, col) {
    var rv = this.cells[this.ordinal(row, col)];
    return (rv === undefined) ? blankCell : rv;
  }
};
