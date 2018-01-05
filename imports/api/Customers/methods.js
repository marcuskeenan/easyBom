import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Customers from './Customers';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'customers.insert': function customersInsert(doc) {
    check(doc, {
      title: String,
      body: String,
    });

    try {
      return Customers.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.update': function customersUpdate(doc) {
    check(doc, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const customerId = doc._id;
      Customers.update(customerId, { $set: doc });
      return customerId; // Return _id so we can redirect to customer after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.remove': function customersRemove(customerId) {
    check(customerId, String);

    try {
      return Customers.remove(customerId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'customers.insert',
    'customers.update',
    'customers.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
