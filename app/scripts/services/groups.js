'use strict';

angular.module('GroupsService', []).service('Groups', function () {

  var blankGroup = new Message(blank, blank), // jshint ignore:line
      groups = [
        blankGroup,
        /* jshint ignore:start */
        new Message('7DaysAllPatients', '7 Days All Patients'),  // jshint ignore:line
        new Message('30DaysAllPatients', '30 Days All Patients'),  // jshint ignore:line
        new Message('90DaysAllPatients', '90 Days All Patients'),
        new Message('NoData', 'No Data'),
        new Message('7DaysAtRisk', '7 Days At Risk'),
        new Message('30DaysAtRisk', '30 Days At Risk'),
        new Message('InCompliance', 'Compliance Met')
        /* jshint ignore:end */
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
    if (this.hasGroup(blankGroup)) {
      groups.splice(groups.indexOf(this.findGroup(blankGroup.name)), 1);
    }
    // Add to top of the list
    groups.unshift(blankGroup); // jshint ignore:line
  };
  this.dupGroup = function(oldGroup) {
    var message = new Message(oldGroup.name); // jshint ignore:line
    for (var j = 0; j < oldGroup.strings.length; j++) {
      message.addStringCode(oldGroup.strings[j].string, oldGroup.strings[j].code);
    }
    return message;
  };
  this.setGroups = function (grps, replace) {
    if (replace) {
      groups = [];
    }
    for (var i = 0; i < grps.length; i++) {
      this.addGroup(this.dupGroup(grps[i]));
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
