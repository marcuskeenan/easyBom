import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Parts from './Parts';
import Notifications from '../Notifications/Notifications';
import rateLimit from '../../modules/rate-limit';

// manufacturer, manPartNumber, createdAt, updatedAt, name, description, vendors
Meteor.methods({
  'parts.insert': function partsInsert(doc) {
    check(doc, {
      manufacturer: String,
      manPartNumber: String,
      name: String,
      description: String,
      vendor: String,
      cost: Number,
      imageURL: String,
      //tags: Array,
    });

    try {
      return Parts.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'parts.update': function partsUpdate(doc) {
    check(doc, {
      _id: String,
      manufacturer: String,
      manPartNumber: String,
      name: String,
      description: String,
      vendor: String,
      cost: Number,
      imageURL: String,
    });

    try {
      const partId = doc._id;
      Parts.update(partId, { $set: doc });
      return partId; // Return _id so we can redirect to part after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'parts.remove': function partsRemove(partId) {
    check(partId, String);

    try {
      return Parts.remove(partId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'parts.tag': function partsTag(partId, tags) {
    console.log(`tags on parts.tag is ${tags}`);
    check(partId, String);
    check(tags, Array);
    try {
      console.log(`the part right before the update is ${partId}`);
      Parts.update(partId, { $set: { tags } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },

  'parts.favorite': function partsFavorite(partId) {
    check(partId, String);

    try {
      const part = Parts.findOne({ _id: partId });
      console.log(`the part is ${part}`);
      const hasFavorited = part.favorites.indexOf(this.userId) > -1;
      const user = Meteor.users.findOne(this.userId);
      Parts.update(partId, { [hasFavorited ? '$pull' : '$addToSet']: { favorites: this.userId } });

      if (!hasFavorited) {
        Notifications.insert({
          recipient: part.owner,
          message: `<strong>${user.profile.name.last}</strong> favorited a one of your parts! <strong>${part.name}</strong>.`,
          icon: {
            symbol: 'star',
            background: '#17a2b8',
          },
          action: `/parts/${partId}`,
        });
      }
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'parts.insert',
    'parts.update',
    'parts.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
