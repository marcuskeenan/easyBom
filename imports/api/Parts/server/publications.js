import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';
import Parts from '../Parts';
import Comments from '../../Comments/Comments';


// need to create if statement for admin role to view all parts
Meteor.publish('parts', () => {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Parts.find({ });
  }
  return Parts.find({ });
});

// Note: parts.view is also used when editing an existing part.
Meteor.publish('parts.view', function documentsView(documentId, isEditing) {
  check(documentId, String);
  check(isEditing, Match.Maybe(Boolean));

  const query = { _id: documentId };
  if (isEditing) query.owner = this.userId;

  // Run a separate query for the actual comments vs. the one we use for the count as the counter
  // modifies the query, omitting any fields other than _id.
  Counts.publish(this, 'documents.view.commentCount', Comments.find({ documentId }));
  const comments = Comments.find({ documentId });

  return [
    Parts.find(query),
    comments,
    Meteor.users.find({ _id: { $in: comments.fetch().map(({ author }) => author) } }, { profile: { profile: 1 } }),
  ];
});
