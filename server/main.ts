import { loadParties } from './imports/fixtures/parties';
import {Meteor} from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import './imports/publications/categorycollection';
//import './imports/publications/cloudservice';

//import './imports/publications/images';
Meteor.startup(() => {
  // load initial Parties
  loadParties();
   
  
});




