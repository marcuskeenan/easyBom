/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Customers = new Mongo.Collection('Customers');

Customers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Customers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Customers.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this customer belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this customer was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this customer was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the customer.',
  },
  body: {
    type: String,
    label: 'The body of the customer.',
  },
});

Customers.attachSchema(Customers.schema);

export default Customers;
