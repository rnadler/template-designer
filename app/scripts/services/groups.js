'use strict';

function Group(name, desc) {
  this.name = name;
  this.desc = desc;
}

angular.module('GroupsService', []).service('Groups', function () {
  var blankGroup = new Group(blank, blank), // jshint ignore:line
      groups = [
        blankGroup,
        new Group('7DaysAllPatients', '7 Days All Patients'),
        new Group('30DaysAllPatients', '30 Days All Patients'),
        new Group('90DaysAllPatients', '90 Days All Patients'),
        new Group('NoData', 'No Data'),
        new Group('7DaysAtRisk', '7 Days At Risk'),
        new Group('30DaysAtRisk', '30 Days At Risk'),
        new Group('InCompliance', 'Compliance Met')
      ];
  this.hasGroup = function(group) {
    return this.findGroup(group.name) !== undefined;
  };
  this.getGroups = function () {
      return groups;
  };
  // Make sure Blank always exists and is at the top of the list
  this.normalizeBlank = function() {
    // remove existing
    var index = groups.indexOf(blankGroup);
    if (index > -1) {
      groups.splice(index, 1);
    }
    // Add to top of the list
    groups.unshift(blankGroup); // jshint ignore:line
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
    if (oldGroup === blankGroup || this.hasGroup(newGroup)) {
      return -1;
    }
    var index = groups.indexOf(oldGroup);
    if (index > -1) {
      groups[index] = newGroup;
    }
    return index;
  };
  this.removeGroup = function(group) {
    if (group === blankGroup) { // jshint ignore:line
      return -1;
    }
    var index = groups.indexOf(group);
    if (index > -1) {
      groups.splice(index, 1);
    }
    return index;
  };
  this.findGroup = function(groupName) {
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].name === groupName) {
        return groups[i];
      }
    }
    return undefined;
  };
});
