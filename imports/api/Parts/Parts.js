/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Parts = new Mongo.Collection('Parts');

Parts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Parts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// manufacturer, manPartNumber, createdAt, updatedAt, name, description, vendors
Parts.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this document belongs to.',
  },
  manufacturer: {
    type: String,
    label: 'The ID of the user this part belongs to.',
  },
  manPartNumber: {
    type: String,
    label: 'The ID of the user this part belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this part was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this part was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The title of the part.',
  },
  description: {
    type: String,
    label: 'The body of the part.',
  },
  imageURL: {
    type: String,
    label: 'The img url.',
  },
  vendor: {
    type: String,
    label: 'The body of the part.',
  },
  cost: {
    type: Number,
    label: 'The cost of the part.',
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

Parts.attachSchema(Parts.schema);

export default Parts;
