'use strict';

angular.module('GroupsService', []).service('Groups', function () {
  var groups = [
    blank,
    '7daysAllPatients',
    '30daysAllPatients',
    '90daysAllPatients',
    'NoData',
    '7daysAtRisk',
    '30daysAtRisk',
    'InCompliance'
  ];

  this.getGroups = function () {
      return groups;
  };
  this.addGroup = function(group) {
    groups.push(group);
  };
  this.addGroup = function(group) {
    groups.push(group);
  };
  this.removeGroup = function(group) {
    var index = groups.indexOf(group);
    if (index > -1) {
      groups.splice(index, 1);
    }
    return index;
  };
});
