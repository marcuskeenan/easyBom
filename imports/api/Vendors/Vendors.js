/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const Vendors = new Mongo.Collection('Vendors');

Vendors.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Vendors.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// manufacturer, manVendorNumber, createdAt, updatedAt, name, description, vendors
Vendors.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this document belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this vendor was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this vendor was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The title of the vendor.',
  },
  description: {
    type: String,
    label: 'The body of the vendor.',
  },
  imageURL: {
    type: String,
    label: 'The img url.',
  },
  address: {
    type: Array,
    label: 'The cost of the vendor.',
    defaultValue: [],
  },
  'address.$': {
    type: Object,
    label: 'Address',
  },
  'address.$._id': {
    type: String,
    label: 'The unique id for this address',
    autoValue() {
      if (this.isInsert) return Random.id();
      return this.value;
    },
  },
  'address.$.name': {
    type: Object,
    label: 'Address Name',
  },
  'address.$.street': {
    type: Object,
    label: 'Street Address',
  },
  'address.$.street2': {
    type: Object,
    label: 'Street Address 2',
  },
  'address.$.city': {
    type: Object,
    label: 'City',
  },
  'address.$.state': {
    type: Object,
    label: 'State',
  },
  'address.$.zip': {
    type: Object,
    label: 'zip code',
  },
  contacts: {
    type: Array,
    label: 'The contacts for this recipient.',
    min: 1,
  },
  'contacts.$': {
    type: Object,
    label: 'A contact for this recipient.',
  },
  'contacts.$._id': {
    type: String,
    label: 'The unique ID for this contact.',
    autoValue() {
      if (this.isInsert) return Random.id();
      return this.value;
    },
  },
  'contacts.$.firstName': {
    type: String,
    label: 'The first name of the contact.',
  },
  'contacts.$.lastName': {
    type: String,
    label: 'The first name of the contact.',
  },
  'contacts.$.emailAddress': {
    type: String,
    label: 'The email address of the contact.',
  },
  favorites: {
    type: Array,
    label: 'Users who have favorited this document.',
    defaultValue: [],
  },
  'favorites.$': {
    type: String,
    label: 'A user who has favorited this document.',
  },
  tags: {
    type: Array,
    label: 'The tags for the document.',
    defaultValue: [],
    optional: true,
  },
  'tags.$': {
    type: Object,
    label: 'The tag id.',
  },
  'tags.$.id': {
    type: Number,
    label: 'The tag id.',
  },
  'tags.$.text': {
    type: String,
    label: 'The tag text.',
  },
  /*
  vendors: {
    type: Array,
  },
  'vendors.$': Object,
  'vendors.$.name': String,
  'vendors.$.price': String,
  */

});

Vendors.attachSchema(Vendors.schema);

export default Vendors;
