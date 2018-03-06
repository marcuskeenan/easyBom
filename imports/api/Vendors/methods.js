import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Vendors from './Vendors';
import Notifications from '../Notifications/Notifications';
import rateLimit from '../../modules/rate-limit';

// manufacturer, manVendorNumber, createdAt, updatedAt, name, description, vendors
Meteor.methods({
  'vendors.insert': function vendorsInsert(doc) {
    check(doc, {
      manufacturer: String,
      manVendorNumber: String,
      name: String,
      description: String,
      vendor: String,
      cost: Number,
      imageURL: String,
      //tags: Array,
    });

    try {
      return Vendors.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'vendors.update': function vendorsUpdate(doc) {
    check(doc, {
      _id: String,
      manufacturer: String,
      manVendorNumber: String,
      name: String,
      description: String,
      vendor: String,
      cost: Number,
      imageURL: String,
    });

    try {
      const vendorId = doc._id;
      Vendors.update(vendorId, { $set: doc });
      return vendorId; // Return _id so we can redirect to vendor after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'vendors.remove': function vendorsRemove(vendorId) {
    check(vendorId, String);

    try {
      return Vendors.remove(vendorId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'vendors.tag': function vendorsTag(vendorId, tags) {
    console.log(`tags on vendors.tag is ${tags}`);
    check(vendorId, String);
    check(tags, Array);
    try {
      console.log(`the vendor right before the update is ${vendorId}`);
      Vendors.update(vendorId, { $set: { tags } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },

  'vendors.favorite': function vendorsFavorite(vendorId) {
    check(vendorId, String);

    try {
      const vendor = Vendors.findOne({ _id: vendorId });
      console.log(`the vendor is ${vendor}`);
      const hasFavorited = vendor.favorites.indexOf(this.userId) > -1;
      const user = Meteor.users.findOne(this.userId);
      Vendors.update(vendorId, { [hasFavorited ? '$pull' : '$addToSet']: { favorites: this.userId } });

      if (!hasFavorited) {
        Notifications.insert({
          recipient: vendor.owner,
          message: `<strong>${user.profile.name.last}</strong> favorited a one of your vendors! <strong>${vendor.name}</strong>.`,
          icon: {
            symbol: 'star',
            background: '#17a2b8',
          },
          action: `/vendors/${vendorId}`,
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
    'vendors.insert',
    'vendors.update',
    'vendors.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
