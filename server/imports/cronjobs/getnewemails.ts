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
    SyncedCron
} from 'meteor/percolate:synced-cron';
import * as _ from 'lodash';
import {
    Csvdata,
    Users,
    Emaillist
} from '../../../both/collections/csvdata.collection';
declare var process: any;
export function getnewemails() {
    SyncedCron.add({
        name: 'Get New Emails',
        schedule: function(parser) {
            // parser is a later.parse object
            //('every 24 hours') or ('at 04:01 pm') or ('every 1 mins')
            return parser.text('at 04:01 pm');
        },
        job: function() {
            HTTP.call('GET', 'http://excellencetechnologies.co.in/imap/?email=acc.excellence2017@gmail.com&pass=java@123&date=2016-01-01&host=imap.gmail.com&port=993&encryp=ssl', {}, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.data.data.length);
                    _.forEach(response.data.data, function(value) {
                            // console.log(value);
                            let exists: any;
                            exists=Emaillist.find({
                              $and:[{
                                "email_timestamp":value["email_timestamp"]
                              },{
                                "from":value["from"]
                              }]
                            }).fetch();
                     if(exists && exists[0]) {
                              // console.log(exists);
                              console.log("********** Not Adding Email to collection ***********");
                              console.log("Email id: "+value["email_id"] +" === "+ "exist Email id"+exists[0]["email_id"]);
                              console.log("Email from: "+value["from"]+" === "+ "exist Email from"+exists[0]["from"]);
                              console.log("Email Timestamp: "+value["email_timestamp"]+" === "+ "Email Timestamp:"+exists[0]["email_timestamp"]);
                              console.log("this email is already exists in db");
                            }
                            else{
                              console.log("********** Adding new Email to collection ***********");
                              console.log("Email id: "+value["email_id"]);
                              console.log("Email from: "+value["from"]);
                              console.log("Email Timestamp: "+value["email_timestamp"]);
                              Emaillist.insert(value);
                            }
                     });
                    // console.log(response.data.data[1]);
                }
            });
        }
    });
    SyncedCron.start();
}