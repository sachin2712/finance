import { 
Mongo 
} from 'meteor/mongo';
import { 
Meteor 
} from 'meteor/meteor';
import { 
check 
} from 'meteor/check'; 
// import { Party } from '../models/party.model';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MongoObservable
} from 'meteor-rxjs'; 
export const Message = new MongoObservable.Collection('message');

Meteor.users.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
      });
Message.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
});

Meteor.methods({
  'messageinsert'(){

  },
  'adduser'(adduserinfo){
     check(adduserinfo.username, String);
     check(adduserinfo.email, String);
     check(adduserinfo.password, String);
     Accounts.createUser(adduserinfo);
  },
  'removeuser'(user){
      check(user._id,String);
      Meteor.users.remove(user._id);
  }
});