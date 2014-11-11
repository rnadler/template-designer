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
});
