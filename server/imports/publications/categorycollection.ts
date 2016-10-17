import {
    Csvdata,
    Productcategory
} from '../../../both/collections/csvdata.collection';
import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import {
    Accounts
} from 'meteor/accounts-base';

if (Meteor.isServer) {
    Meteor.publish('csvdata', function() {
        if (Roles.userIsInRole(this.userId, 'Accounts') || Roles.userIsInRole(this.userId, 'guest')) {
            const selector = {
                'Assigned_user_id': this.userId
            };
            return Csvdata.find(selector);
        } else {
            return Csvdata.find();
        }

    });

    Meteor.publish('Productcategory', function() {

        return Productcategory.find();

    });

    Meteor.publish("userData", function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Meteor.users.find();
        } else {
            const selector = {
                '_id': this.userId
            };
            return Meteor.users.find(selector);
        }
    });
}