import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';
import Boms from '../Boms';
import Comments from '../../Comments/Comments';

// need to create if statement for admin role to view all boms
Meteor.publish('boms', () => {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return Boms.find({ });
  }
  return Boms.find({ });
});


Meteor.publishComposite('boms.list', {
  find() {
    return Boms.find({ });
  },
  children: [
    {
      find(bom) {
        // Find post author. Even though we only want to return
        // one record here, we use "find" instead of "findOne"
        // since this function should return a cursor.
        return Meteor.users.find(
          { _id: bom.owner },
          { fields: { profile: 1 } },
        );
      },
    },
  ],
});

// Note: boms.view is also used when editing an existing bom.
Meteor.publish('boms.view', function documentsView(documentId, isEditing) {
  check(documentId, String);
  check(isEditing, Match.Maybe(Boolean));

  const query = { _id: documentId };
  if (isEditing) query.owner = this.userId;

  // Run a separate query for the actual comments vs. the one we use for the count as the counter
  // modifies the query, omitting any fields other than _id.
  Counts.publish(this, 'documents.view.commentCount', Comments.find({ documentId }));
  const comments = Comments.find({ documentId });

  return [
    Boms.find(query),
    comments,
    Meteor.users.find({ _id: { $in: comments.fetch().map(({ author }) => author) } }, { profile: { profile: 1 } }),
  ];
});

