import {loadParties} from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';
//import { Mongo } from 'meteor/mongo';
//import { Csvdata } from '../both/collections/csvdata.collection';
//import { Productcategory } from '../both/collections/addcategory.collection';

Meteor.startup(() => {
  // load initial Parties
  loadParties();
});




