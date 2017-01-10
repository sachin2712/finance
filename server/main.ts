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
    Meteor.users.find({ "status.online": true }).observe({
     added: function(id: any) {
        // id just came online
        console.log("--------- New User Login ---------");
        console.log("user " + id.username + " (" + id._id + ") is online now");

      },
     removed: function(id: any) {
       // id just went offline
       console.log("----------- User idle --------------");
       console.log("user " + id.username + " (" + id._id + ") is gone offline");
       Meteor.users.update({ _id: id._id }, {$set : { "services.resume.loginTokens" : [] }}, {multi:true});
     }
  });
});