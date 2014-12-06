'use strict';

angular.module('GroupsService', []).service('Groups', function () {
  var groups = [
    blank,  // jshint ignore:line
    '7DaysAllPatients',
    '30DaysAllPatients',
    '90DaysAllPatients',
    'NoData',
    '7DaysAtRisk',
    '30DaysAtRisk',
    'InCompliance'
  ];
  this.hasGroup = function(group) {
    return groups.indexOf(group) > -1;
  };
  this.getGroups = function () {
      return groups;
  };
  // Make sure Blank always exists and is at the top of the list
  this.normalizeBlank = function() {
    // remove existing
    var index = groups.indexOf(blank); // jshint ignore:line
    if (index > -1) {
      groups.splice(index, 1);
    }
    // Add to top of the list
    groups.unshift(blank); // jshint ignore:line
  };
  this.setGroups = function (grps, replace) {
    if (replace) {
      groups = grps;
    } else {
      for (var i = 0; i < grps.length; i++) {
        this.addGroup(grps[i]);
      }
    }
    this.normalizeBlank();
    return groups;
  };
  this.addGroup = function(group) {
    return this.hasGroup(group) ? -1 : groups.push(group);
  };
  this.changeGroup = function(oldGroup, newGroup) {
    if (oldGroup === blank || this.hasGroup(newGroup)) { // jshint ignore:line
      return -1;
    }
    var index = groups.indexOf(oldGroup);
    if (index > -1) {
      groups[index] = newGroup;
    }
    return index;
  };
  this.removeGroup = function(group) {
    if (group === blank) { // jshint ignore:line
      return -1;
    }
    var index = groups.indexOf(group);
    if (index > -1) {
      groups.splice(index, 1);
    }
    return index;
  };
});
