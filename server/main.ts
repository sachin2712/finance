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
//     Meteor.users.find({ "status.online": true }).observe({
//     added: function(id) {
//     // id just came online
//      },
//      removed: function(id) {
//     // id just went offline
//     Meteor.users.update({_id:id}, {$set : { "resume.loginTokens" : [] }}, {multi:true});
//    }
// });


});