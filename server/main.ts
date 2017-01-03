import {
    loadParties
} from './imports/fixtures/parties';
import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Accounts
} from 'meteor/accounts-base';
import { 
	accounting 
} from 'meteor/iain:accounting';

import './imports/publications/categorycollection';

Meteor.startup(() => {
    // load initial Parties
    loadParties();
});