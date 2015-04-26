'use strict';


var CodedItem = Class.create({ // jshint ignore:line
  initialize: function (desc, code) {
    this.code = code;
    this.desc = desc;
    this.description = function () {
      return this.desc + ' [' + this.code + ']';
    };
  }
});

var CodedItemList = Class.create({ // jshint ignore:line
  initialize: function () {
    this.list = [];
  },
  getList: function () {
    return this.list;
  },
  addItem: function (item) {
    this.list.push(item);
    return this;
  },
  findItem: function (code) {
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].code === code) {
        return this.list[i];
      }
    }
    return undefined;
  }
});

