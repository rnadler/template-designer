'use strict';

function Template(name, rows, columns) {
  this.message = new Message(name); // jshint ignore:line
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
    new Template('template-4x4', 4, 4),
    new Template('template-3x3', 3, 3),
    new Template('template-2x2', 2, 2)
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
        nt = new Template(temp.message.name, temp.rows, grid.columns);
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
    var t;
    if (replace) {
      templates = [];
      for (t in tmplts) {
        templates.push(this.dupTemplate(tmplts[t]));
      }
    } else {
      for (t in tmplts) {
        var temp = tmplts[t];
        if (this.hasTemplate(temp.message.name) === false) {
          templates.push(this.dupTemplate(temp));
        }
      }

    }
    return templates;
  };
  this.addTemplate = function(templateName, rows, columns) {
    if (this.hasTemplate(templateName) === true) {
      return -1;
    }
    return templates.push(new Template(templateName, rows, columns));
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
        if (cell.name === oldGroup) {
          cell.name = newGroup === '' ? blank : newGroup; // jshint ignore:line
        }
      }
    }
  };
});
