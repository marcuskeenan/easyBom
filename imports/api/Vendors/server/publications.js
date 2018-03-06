import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';
import Vendors from '../Vendors';
import Comments from '../../Comments/Comments';


// need to create if statement for admin role to view all vendors
Meteor.publish('vendors', () => {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Vendors.find({ });
  }
  return Vendors.find({ });
});

// Note: vendors.view is also used when editing an existing vendor.
Meteor.publish('vendors.view', function documentsView(documentId, isEditing) {
  check(documentId, String);
  check(isEditing, Match.Maybe(Boolean));

  const query = { _id: documentId };
  if (isEditing) query.owner = this.userId;

  // Run a separate query for the actual comments vs. the one we use for the count as the counter
  // modifies the query, omitting any fields other than _id.
  Counts.publish(this, 'documents.view.commentCount', Comments.find({ documentId }));
  const comments = Comments.find({ documentId });

  return [
    Vendors.find(query),
    comments,
    Meteor.users.find({ _id: { $in: comments.fetch().map(({ author }) => author) } }, { profile: { profile: 1 } }),
  ];
});
