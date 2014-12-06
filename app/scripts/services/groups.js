'use strict';

angular.module('GroupsService', []).service('Groups', function () {
  var groups = [
    blank,  // jshint ignore:line
    '7daysAllPatients',
    '30daysAllPatients',
    '90daysAllPatients',
    'NoData',
    '7daysAtRisk',
    '30daysAtRisk',
    'InCompliance'
  ];
  this.hasGroup = function(group) {
    return groups.indexOf(group) > -1;
  };
  this.getGroups = function () {
      return groups;
  };
  this.setGroups = function (grps) {
    groups = grps;
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
