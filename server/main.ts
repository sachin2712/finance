import {
    loadinitialheads
} from './imports/fixtures/loadinitialheads';
import {
    reminderinvoice
} from './imports/cronjobs/dailyanalysis';
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
import {
    Csvdata,
    Productcategory,
    Users,
    Graphdata,
    Subcategory,
    Head,
    Accounts_no,
    Graphlist,
    CategoryGraphList
} from '../both/collections/csvdata.collection';

import './imports/publications/categorycollection';

Meteor.startup(() => {
    // loadParties 
    loadinitialheads();
    reminderinvoice();
    // console.log(process.env);
    //example for setting process env variable values
    // process.env.MAIL_URL = "smtp://amit@excellencetechnologies.in:878@smtp.gmail.com:465";

    // ** use this code only if you want to detect which user come online **
    //   Meteor.users.find({ "status.online": true }).observe({
    //    added: function(id: any) {
    //       // id just came online
    //       console.log("--------- New User Login ---------");
    //       console.log("user " + id.username + " (" + id._id + ") is online now");
    //     },
    //    removed: function(id: any) {
    //      // id just went offline
    //      console.log("----------- User idle --------------");
    //      console.log("user " + id.username + " (" + id._id + ") is gone offline");
    //    }
    // });
});