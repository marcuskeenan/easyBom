import { Meteor } from 'meteor/meteor';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
      roles: 1,
    },
  });
});

Meteor.publish('users', function () {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Meteor.users.find({});
  }
  return Meteor.users.find({ _id: this.userId });
});
