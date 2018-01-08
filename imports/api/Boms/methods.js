import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Boms from './Boms';
import Notifications from '../Notifications/Notifications';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'boms.insert': function bomsInsert(doc) {
    check(doc, {
      name: String,
      description: String,
      // tags: Array,
      // parts: Array
    });

    try {
      return Boms.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.update': function bomsUpdate(doc) {
    console.log('Boms update just ran');
    check(doc, {
      _id: String,
      name: String,
      description: String,
      // tags: Array,
      // parts: Array,
    });

    try {
      const bomId = doc._id;
      Boms.update(bomId, { $set: doc });
      return bomId; // Return _id so we can redirect to bom after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.remove': function bomsRemove(bomId) {
    check(bomId, String);

    try {
      return Boms.remove(bomId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.tag': function bomsTag(bomId, tags) {
    console.log(`tags on boms.tag is ${tags}`);
    check(bomId, String);
    check(tags, Array);
    try {
      console.log(`the bom right before the update is ${bomId}`);
      Boms.update(bomId, { $set: { tags } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.favorite': function bomsFavorite(bomId) {
    check(bomId, String);

    try {
      const bom = Boms.findOne({ _id: bomId });
      console.log(`the bom is ${bom}`);
      const hasFavorited = bom.favorites.indexOf(this.userId) > -1;
      const user = Meteor.users.findOne(this.userId);
      Boms.update(bomId, { [hasFavorited ? '$pull' : '$addToSet']: { favorites: this.userId } });

      if (!hasFavorited) {
        Notifications.insert({
          recipient: bom.owner,
          message: `<strong>${user.profile.name.last}</strong> favorited a one of your boms! <strong>${bom.name}</strong>.`,
          icon: {
            symbol: 'star',
            background: '#17a2b8',
          },
          action: `/boms/${bomId}`,
        });
      }
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.updatePart': function bomsUpdatePart(bomId, part) {
    check(bomId, String);
    check(part, Object);
    try {
      //  console.log(`the bom id is ${bomId}, the part id is ${part.id} and the qty is ${part.quantity}`);
      Boms.update({ _id: bomId, 'parts.id': part.id }, { $set: { 'parts.$.quantity': part.quantity } });
      console.log('done');
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'boms.deletePart': function bomsDeletePart(bomId, rowKeys) {
    check(bomId, String);
    check(rowKeys, Array);
    try {
      rowKeys.forEach(function(element) {
        console.log(element);
        Boms.update({ _id: bomId }, { $pull: { parts: { id: element } } } );
        console.log('done');
      });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },

});

rateLimit({
  methods: [
    'boms.insert',
    'boms.update',
    'boms.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
