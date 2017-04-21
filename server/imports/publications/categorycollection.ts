import {
    Csvdata,
    Productcategory,
    Users,
    Graphdata,
    Subcategory,
    Head,
    Accounts_no,
    Graphlist,
    CategoryGraphList,
    Comments,
    Salaryfiles,
    emailpatterncollection,
    Emaillist
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
import { 
    Roles 
} from 'meteor/alanning:roles';

interface Options {
    [key: string]: any;
}

// if (Meteor.isServer) {

    Meteor.publish('csvdata', function() {
        if (Roles.userIsInRole(this.userId, 'Accounts')) {
            const selector = {
                'Assigned_user_id': this.userId
            };
            return Csvdata.find(selector);
        } else {
            return Csvdata.find();
        }
    });

    Meteor.publish('emailpattern', function(){
        // if(Roles.userIsInRole(this.userId, 'admin')){
            return emailpatterncollection.find();
        // }
    });

    Meteor.publish('emaillistarray', function(){
        return Emaillist.find();
    });

    Meteor.publish('uniqueemail', function(option : string) {
             console.log(option);
            // var uniquedata = Csvdata.findOne({"_id":option});
            // Csvdata.publish(this, "uniquetransaction", uniquedata)
            // console.log(uniquedata);

            return Emaillist.find({"_id": option});
            
            // return uniquedata;

    });

    Meteor.publish('csvdata_unprocessed', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            const selector = {
                "is_processed": 0
            };
            return Csvdata.find(selector);
        }
    });
    
    // *** use this publish if want monthly data for graph ***
    Meteor.publish('csvdata_month', function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Graphdata.find({});
        } else {
            this.ready()
        }

    });
    
    Meteor.publish('graphlist', function(){
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return Graphlist.find({});
        } else {
            this.ready()
        }
    }); 

    Meteor.publish('categorygraphlist', function(){
        if (Roles.userIsInRole(this.userId, 'admin')) {
            return CategoryGraphList.find({});
        } else {
            this.ready()
        }
    });   

    Meteor.publish('Productcategory', function() {
        var product_order = {};
        product_order["category"] = 1;
        return Productcategory.find({}, {
            sort: product_order
        });
    });

    Meteor.publish('Subcategory', function() {
          // if (Roles.userIsInRole(this.userId, 'admin')) {
               return Subcategory.find({});
        // } else {
        //     this.ready()
        // }
    });

    // *** head part for income expenses ***

    Meteor.publish('headlist', function() {
          // if (Roles.userIsInRole(this.userId, 'admin')) {
               return Head.find({});
        // } else {
        //     this.ready()
        // }
    });

    Meteor.publish('Accounts_no', function() {
          // if (Roles.userIsInRole(this.userId, 'admin')) {
               return Accounts_no.find({});
        // } else {
        //     this.ready()
        // }
    });

    Meteor.publish("userData", function() {
        // if (Roles.userIsInRole(this.userId, 'admin')) {
            var field ={
                "createdA":1,
                "username":1,
                "emails": 1,
                "profile": 1,
                "roles": 1,
                "status": 1
            }
            return Meteor.users.find({},{"fields": field});
        // } else {
        //     const selector = {
        //         '_id': this.userId
        //     };
        //     return Meteor.users.find(selector);
        // }
    });
 
    // ********  salary details file upload collection *********
    Meteor.publish('Salaryfiles', function() {
        return Salaryfiles.collection.find({});
    });

    Meteor.publish("Commentslist", function(option : string){
        console.log(option);
        return Comments.find({"transactionid": option});
    });
// }