import {loadParties} from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  // load initial Parties
  loadParties();
});




