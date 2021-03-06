/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Boms = new Mongo.Collection('Boms');

Boms.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Boms.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Boms.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this BOM belongs to.',
  },
  version: {
    type: String,
    label: 'version',
  },
  createdAt: {
    type: String,
    label: 'The date this BOM was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this BOM was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  name: {
    type: String,
    label: 'The title of the BOM.',
  },
  description: {
    type: String,
    label: 'The body of the BOM.',
  },
  company: {
    type: String,
    label: 'company.',
  },
  parts: {
    type: Array,
    label: 'Part in the BOM',
    defaultValue: [],
  },
  'parts.$': {
    type: Object,
    label: 'A user who has favorited this bom.',
  },
  'parts.$.id': {
    type: String,
    label: 'A user who has favorited this bom.',
  },
  'parts.$.quantity': {
    type: Number,
    label: 'A user who has favorited this bom.',
  },
  total: {
    type: String,
    label: 'The total price of the invoice when it was sent in cents.',
    optional: true,
  },
  favorites: {
    type: Array,
    label: 'Users who have favorited this bom.',
    defaultValue: [],
  },
  'favorites.$': {
    type: String,
    label: 'A user who has favorited this bom.',
  },
  tags: {
    type: Array,
    label: 'The tags for the bom.',
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
});

Boms.attachSchema(Boms.schema);

export default Boms;
