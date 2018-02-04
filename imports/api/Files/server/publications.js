
import { Meteor } from 'meteor/meteor';
import Files from '../Files';

Meteor.publish('files', () => Files.find());
