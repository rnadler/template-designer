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
  setItems: function(items) {
    this.list = [];
    for (var i = 0; i < items.length; i++) {
      this.addItem(new CodedItem(items[i].desc, items[i].code));
    }
    return this.list;
  },
  findItem: function (code) {
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].code === code) {
        return this.list[i];
      }
    }
    return undefined;
  },
  queryItemByCode: function(query) {
    var result = [],
        alwaysAdd = query === undefined || query.length === 0;
    for (var i = 0; i < this.list.length; i++) {
      if (alwaysAdd || this.list[i].code.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        result.push(this.list[i]);
      }
    }
    return result;
  },
  getItemsFromCodes: function(codes) {
    var result = [];
    for (var i = 0; i < codes.length; i++) {
        result.push(this.findItem(codes[i]));
    }
    return result;
  }
});

