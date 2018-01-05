import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
//import { publishComposite } from 'meteor/reywood:publish-composite';
import Documents from '../Documents';


// need to create if statement for admin role to view all documents
Meteor.publish('documents', function documents() {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Documents.find({ });
  }
  return Documents.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('documents.view', function documentsView(documentId) {
  check(documentId, String);
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Documents.find({ _id: documentId });
  }
  return Documents.find({ _id: documentId, owner: this.userId });
});

Meteor.publishComposite('documentsList', {
  find() {
    return Documents.find({});
  },
  children: [
    {
      find(document) {
        return Meteor.users.find({ _id: document.owner }, { fields: { profile: 1 } });
      },
    },

  ],
});


Meteor.publishComposite('dlist', function(owner) {  
  return {
    find: function() {
      // Find the current user's following users
      return Documents.find({ });
    },
    children: [{
      find: function(document) {
        // Find tweets from followed users
        return Meteor.users.find(
          { _id: document.owner },
          { limit: 1, fields: { emails: 1 } });
      }
    }]
  }
});
