'use strict';

function Template(message, rows, columns) {
  this.message = message; // jshint ignore:line
  this.rows = rows;
  this.grid = new Grid(columns); // jshint ignore:line
}
Template.prototype = {

  getColumns: function () {
    return this.grid.columns;
  },

  setColumns: function (columns) {
    this.grid.columns = columns;
  },
  setName: function(name) {
    this.message.name = name;
  },
  getName: function() {
    return this.message.name;
  },
  getMessageString: function(language) {
    return this.message.getString(language);
  },
  addMessageString: function(string, language) {
    this.message.addString(string, language);
  }
};

angular.module('TemplatesService', []).service('Templates', function () {
  var templates = [
    new Template(new Message('template-4x4','4x4 template'), 4, 4), // jshint ignore:line
    new Template(new Message('template-3x3','3x3 template'), 3, 3), // jshint ignore:line
    new Template(new Message('template-2x2','2x2 template'), 2, 2)  // jshint ignore:line
  ];
  this.hasTemplate = function(name) {
    for(var i = 0; i < templates.length; i++) {
      if(templates[i].message.name === name) {
        return true;
      }
    }
    return false;
  };
  this.getTemplates = function () {
      return templates;
  };
  this.dupTemplate = function (temp) {
    // The JSON version of the Template object needs to be reconstituted to include the prototypes.
    // There's probably a better way to do this, but this works for now...
    var c,
        grid = temp.grid,
        nt = new Template(new Message(temp.message.name), temp.rows, grid.columns); // jshint ignore:line
    for (var j = 0; j < temp.message.strings.length; j++) {
      nt.message.addStringCode(temp.message.strings[j].string, temp.message.strings[j].code);
    }
    for (c in grid.cells) {
      var cell = grid.cells[c];
      nt.grid.cells[c] = new Cell(cell.name, cell.color); // jshint ignore:line
    }
    return nt;
  };
  this.setTemplates = function (tmplts, replace) {
    var t, temp;
    if (replace) {
      templates = [];
    }
    for(t = 0; t < tmplts.length; t++) {
      temp = tmplts[t];
      if (replace || this.hasTemplate(temp.message.name) === false) {
        templates.push(this.dupTemplate(temp));
      }
    }
    return templates;
  };
  this.addTemplate = function(templateName, rows, columns) {
    if (this.hasTemplate(templateName) === true) {
      return -1;
    }
    return templates.push(new Template(new Message(templateName), rows, columns)); // jshint ignore:line
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
    var t, c,grid, cell;
    for(t = 0; t < templates.length; t++) {
      grid = templates[t].grid;
      for (c in grid.cells) {
        cell = grid.cells[c];
        if (cell.name === oldGroup) {
          cell.name = newGroup === '' ? blank : newGroup; // jshint ignore:line
        }
      }
    }
  };
});
