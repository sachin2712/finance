import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MongoObservable
} from 'meteor-rxjs';
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
  Roles 
} from 'meteor/alanning:roles';
import { 
  Email 
} from 'meteor/email';
import * as moment from 'moment';
import * as _ from 'lodash';

export const Csvdata = new MongoObservable.Collection('csvdata');
export const Productcategory = new MongoObservable.Collection('Productcategory');
export const Head = new MongoObservable.Collection('Head');
export const Subcategory = new MongoObservable.Collection('Subcategory');
// *** Graphdata will store month wise info of CR and DR ***
export const Graphdata = new MongoObservable.Collection('graphdata');
export const Graphlist = new MongoObservable.Collection('graphlist');
export const CategoryGraphList = new MongoObservable.Collection('categorygraphlist');
// *** Accounts no will hold list of Accounts to which we want to assign to any transaction ***
export const Comments = new MongoObservable.Collection('Comments');
export const Accounts_no = new MongoObservable.Collection('Accounts_no');
export const Users = MongoObservable.fromExisting(Meteor.users);
export const Emaillist = new MongoObservable.Collection('Emaillist');


Accounts_no.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Emaillist.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Comments.allow({
    insert: function() {
        if (Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    }
});

Meteor.users.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Graphlist.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
             return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

CategoryGraphList.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
             return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Head.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
             return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Productcategory.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Subcategory.allow({
    insert: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    update: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    },

    remove: function() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Csvdata.allow({
    insert: function() {
        return true;
    },

    update: function() {
        return true;
    },

    remove: function() {
        return true;
    }
});

Meteor.methods({
    'parseUpload' (data, Income, Expense, Account_no ,DateFormat) {
        check(Income, String);
        check(Expense, String);
        check(data, Array);
        let report: any ={};
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        report["invalidtransactionlist"]=[];
        report["updated"]={};
        report["added"]={};
        // console.log(Account_no);
        for (let i = 0; i < data.length; i++) {
            var item = data[i];
            let assigned_head_id: any;
            if (!item["Transaction ID"]) {
                console.log("transaction note have invalid Transaction ID" + item["No."]);
                report["invalidtransactionlist"].push(item["No."]);
                continue;
            }
            if (!item["Txn Posted Date"]) {
                 console.log("transaction note have invalid Txn Posted Date" + item["No."]);
                 report["invalidtransactionlist"].push(item["No."]);
                continue;
            }
            if (!item["Transaction Amount(INR)"]) {
                 console.log("transaction note have invalid Transaction Amount(INR)" + item["No."]);
                 report["invalidtransactionlist"].push(item["No."]);
                continue;
            }
            if(item["Cr/Dr"]=="CR"){
               assigned_head_id=Income;
            }
            if(item["Cr/Dr"]=="DR"){
                assigned_head_id=Expense;
            }
            var txn_posted_date = moment(item["Txn Posted Date"], DateFormat).format('MM-DD-YYYY h:mm:ss a');
            // console.log(txn_posted_date);
            // console.log("assigned head id is" + assigned_head_id);
            let existsCR: any;
            let existsDR: any;
            // var search={};
            // search["Transaction_ID"]= item["Transaction ID"];
            item["ChequeNo."]=isNaN(parseInt(item["ChequeNo."]))? '-':item["ChequeNo."];

            existsCR = Csvdata.find({
                  $and: [{
                            "Transaction_ID": item["Transaction ID"]
                        }, {
                            "Cr/Dr": "CR"
                        },{
                            "ChequeNo": item["ChequeNo."]
                        }
                        ]
            }).fetch();
            // console.log(existsCR);
             existsDR = Csvdata.find({
                  $and: [{
                            "Transaction_ID": item["Transaction ID"]
                        }, {
                            "Cr/Dr": "DR"
                        },{
                            "ChequeNo": item["ChequeNo."]
                        }]
            }).fetch();

            // console.log(existsDR);
            // ** code to check if our csvupload works properly
            // console.log(item["Transaction ID"]);
            // console.log(existsCR);
            // console.log(existsDR);
            // console.log(item["ChequeNo."]);
            // console.log(existsCR && existsCR[0] && existsCR[0]["ChequeNo"]==item["ChequeNo."]);
            // console.log(existsDR && existsDR[0] && existsDR[0]["ChequeNo"]==item["ChequeNo."]);
            // **** In case we are updating our csvdata valules we will use this part **** 
            if(existsCR && existsCR[0] && existsCR[0]["Cr/Dr"]==item["Cr/Dr"] && existsCR[0]["ChequeNo"]==item["ChequeNo."])
                   {
                     // console.log("in updating cr part");
                     if(!report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]){
                         report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]=1;
                     }
                     else{
                       ++report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
                     }
                      console.log("********** updating this transaction in cr ***********");
                      console.log("****** if exists Dr value *****");console.log(existsDR);
                      console.log("****** if exists Cr value *****");console.log(existsCR);
                      console.log("****** item values *** ");console.log(item);
                      console.log("****** end of this transaction ********");
                Csvdata.update({
                      $and: [{
                            "Transaction_ID": item["Transaction ID"]
                        }, {
                            "Cr/Dr": "CR"
                        }]
                }, {
                    $set: {
                        "No": parseInt(item["No."]),
                        "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                        "Txn_Posted_Date": new Date(txn_posted_date),
                        "ChequeNo": item["ChequeNo."],
                        "Description": item["Description"],
                        "Cr/Dr": item["Cr/Dr"],
                        "Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
                        "Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
                        "AssignedAccountNo": Account_no
                            }
                       });
                   }
             else if(existsDR && existsDR[0] && existsDR[0]["Cr/Dr"]==item["Cr/Dr"] && existsDR[0]["ChequeNo"]==item["ChequeNo."]){
                      // console.log("in updating dr part");
                       if(!report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]){
                         report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]]=1;
                          }
                         else{
                             ++report["updated"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
                         }
                          console.log("********** updating this transaction in dr ***********");
                      console.log("****** if exists Dr value *****");console.log(existsDR);
                      console.log("****** if exists Cr value *****");console.log(existsCR);
                      console.log("****** item values *** ");console.log(item);
                      console.log("****** end of this transaction ********");
                        Csvdata.update({
                       $and: [{
                                "Transaction_ID": item["Transaction ID"]
                              }, {
                                  "Cr/Dr": "DR"
                         }]
                 }, {
                    $set: {
                        "No": parseInt(item["No."]),
                        "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                        "Txn_Posted_Date": new Date(txn_posted_date),
                        "ChequeNo": item["ChequeNo."],
                        "Description": item["Description"],
                        "Cr/Dr": item["Cr/Dr"],
                        "Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
                        "Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
                        "AssignedAccountNo": Account_no
                            }
                       });
                }
                else
                {  
                   // if(existsDR || existsCR){
                      console.log("********** adding this new transaction ***********");
                      console.log("****** if exists Dr value *****");console.log(existsDR);
                      console.log("****** if exists Cr value *****");console.log(existsCR);
                      console.log("****** item values *** ");console.log(item);
                      console.log("****** end of this transaction ********");
                   // }

                   if(!report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]]){
                         report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]]=1;
                     }
                     else{
                       ++report["added"][month[moment(item["Txn Posted Date"], DateFormat).month()]];
                     }
                    // console.log("adding new element");
                    Csvdata.insert({
                    "No": parseInt(item["No."]),
                    "Transaction_ID": item["Transaction ID"],
                    "Value_Date": moment(item["Value Date"], DateFormat).format('Do MMMM YYYY'),
                    "Txn_Posted_Date": new Date(txn_posted_date),
                    "ChequeNo": item["ChequeNo."],
                    "Description": item["Description"],
                    "Cr/Dr": item["Cr/Dr"],
                    "Transaction_Amount(INR)": accounting.unformat(item["Transaction Amount(INR)"]),
                    "Available_Balance(INR)": accounting.unformat(item["Available Balance(INR)"]),
                    "Assigned_head_id": assigned_head_id,
                    "Assigned_category_id": "not assigned",
                    "Assigned_parent_id": "not assigned",
                    "is_processed": 0,
                    "invoice_no": "not_assigned",
                    "invoice_description": "invoice_description",
                    "Assigned_user_id": "not_assigned",
                    "Assigned_username": "not_assigned",
                    "AssignedAccountNo": Account_no
                    });
                  }
               }
        return report;
    }, 
    'refresh_category_graph_list'(all_csvdata , all_categoryGraph, subcategoryarray){ // complexity will be O(n2)
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
               // ** fixing database for parent id ** this code is to check if all assigned category have parent_id or not
               // for(let p=0; p < all_csvdata.length; p++){
               //      var product=all_csvdata[p];
               //      console.log("old ChequeNo value: "+product["ChequeNo"]);
               //      product["ChequeNo"]=isNaN(parseInt(product["ChequeNo"]))? '-':product["ChequeNo"];
               //      console.log("new ChequeNo value: "+product["ChequeNo"])
               //      Csvdata.update(
               //           { 
               //             "_id":product["_id"]
               //           },
               //           { 
               //             $set: {
               //              "ChequeNo": product["ChequeNo"]
               //           } }
               //        );
               // }
               //** fixing database for format is done.

               for(let i=0; i < all_categoryGraph.length; i++)
               {
                    var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    // this will store statistic which we find out for each graph
                    let graph_statistic={};
                    for (let j = 0; j < all_csvdata.length; j++) {
                           if(all_csvdata[j]["Assigned_parent_id"]=="not assigned" || all_csvdata[j]["Assigned_parent_id"]==null){
                               continue;
                           }
                           var item = all_csvdata[j];
                           let n: any;
                           let FY: any;
                           let exists_graph: any;
                           let d: any = new Date(item["Txn_Posted_Date"]);
                           let year: number = d.getFullYear();
                           let month_value: number = d.getMonth();
                           let amount: number = accounting.unformat(item["Transaction_Amount(INR)"],".");    
                           amount=Math.round(amount);
                           if(month_value>2){
                               FY='FY'+year;
                             }
                           else{
                              year=year-1;
                              FY='FY'+year;
                              }
                           if(!graph_statistic[FY]){
                                graph_statistic[FY] = {};
                              }
                          let key;
                          if (all_categoryGraph[i].graph_head_list.indexOf(item["Assigned_parent_id"]) != -1) {
                                key= month[month_value];
                                  if(!graph_statistic[FY][item["Assigned_parent_id"]]){
                                          graph_statistic[FY][item["Assigned_parent_id"]] = {};
                                     }   
                                 if(!graph_statistic[FY][item["Assigned_parent_id"]][key]){
                                          graph_statistic[FY][item["Assigned_parent_id"]][key] = 0;
                                   }
                                  graph_statistic[FY][item["Assigned_parent_id"]][key] += amount;  
                             } 
                             else{
                                continue;
                             }
                       }

                       CategoryGraphList.update({
                                      "_id": all_categoryGraph[i]._id
                                       }, {
                                $set: {
                                       "graph_statistic": graph_statistic
                                  }
                       });
               }
              
        }
    }, 
    'refresh_graph_list'(all_csvdata , all_graphs){ // complexity will be O(n2)
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
               for(let i=0; i < all_graphs.length; i++)
               {
                    var month = new Array();
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                    // this will store statistic which we find out for each graph
                    let graph_statistic={};
                    for (let j = 0; j < all_csvdata.length; j++) {
                           var item = all_csvdata[j];
                           let n: any;
                           let FY: any;
                           let exists_graph: any;
                           let d: any = new Date(item["Txn_Posted_Date"]);
                           let year: number = d.getFullYear();
                           let month_value: number = d.getMonth();
                           let amount: number = accounting.unformat(item["Transaction_Amount(INR)"],".");    
                           amount=Math.round(amount);
                           if(month_value>2){
                               FY='FY'+year;
                             }
                           else{
                              year=year-1;
                              FY='FY'+year;
                              }
                           if(!graph_statistic[FY]){
                                graph_statistic[FY] = {};
                              }
                          let key;
                          if (all_graphs[i].graph_head_list.indexOf(item["Assigned_head_id"]) != -1) {
                                key= month[month_value];
                                  if(!graph_statistic[FY][item["Assigned_head_id"]]){
                                          graph_statistic[FY][item["Assigned_head_id"]] = {};
                                     }   
                                 if(!graph_statistic[FY][item["Assigned_head_id"]][key]){
                                          graph_statistic[FY][item["Assigned_head_id"]][key] = 0;
                                   }
                                  graph_statistic[FY][item["Assigned_head_id"]][key] += amount;  
                             } 
                             else{
                                continue;
                             }
                       }

                       Graphlist.update({
                                      "_id": all_graphs[i]._id
                                       }, {
                                $set: {
                                       "graph_statistic": graph_statistic
                                  }
                       });
               }
              
        }
    },

    'addCategory' (Transaction_id, category_id) {
        check(Transaction_id, String);
        check(category_id, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": Transaction_id
            }, {
                $set: {
                    "Assigned_category_id": category_id,
                    "is_processed": 1
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }

    },

    'changeCategory' (id, parent_id,category_id) {
        check(id, String);
        check(category_id, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "Assigned_parent_id": parent_id,
                    "Assigned_category_id": category_id
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'changeheadtag'(id,newhead_id){
        check(id, String);
        check(newhead_id, String);
         if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "Assigned_head_id": newhead_id
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }

    },

    'addInvoice' (id, invoice_no,file_no, description, linkarray) {
        check(id, String);
        check(invoice_no, String);
        check(description, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "invoice_no": invoice_no,
                    "file_no": file_no,
                    "invoice_description": description,
                    "linktodrive": linkarray
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'deleteInvoice' (id) {
        check(id, String);
        if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'Accounts')) {
            Csvdata.update({
                "_id": id
            }, {
                $set: {
                    "invoice_no": "not_assigned",
                    "invoice_description": "invoice_description",
                    "linktodrive": "notassigned"
                }
            });
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'addUser' (adduserinfo) {
        check(adduserinfo.username, String);
        check(adduserinfo.email, String);
        check(adduserinfo.password, String);
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                let userid = Accounts.createUser(adduserinfo);
                Roles.addUsersToRoles(userid, [adduserinfo.profile.role]);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },
     // ******** we will use pending invoice loading function as mongoobservalbe.call to load all pendinginvoice *****
    'pendinginvoiceloading'(currentyear,nextyear){
       if (Roles.userIsInRole(Meteor.userId(), 'admin')){
          var sort_order = {};
          sort_order["Txn_Posted_Date"] = 1;
         var accountusers = Users.find(
           {
             "roles" : "Accounts"
           },{ 
             "fields":{ _id: 1}}
           ).fetch();
         var locs = accountusers.map(function(x) { return x._id } );
         return Csvdata.collection.find({
                        $and: [{  
                            "invoice_no" : { $eq:"not_assigned" }
                             }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(currentyear),
                                $lt: new Date(nextyear)
                              }
                              },{
                            "Cr/Dr": "DR"
                             },{
                            "Assigned_user_id":{ "$in": locs }
                             }]
                          }, {
                        sort: sort_order
                     }).fetch();
                   }
       else {
          throw new Meteor.Error(403, "Access denied");
       }
    },
        'completeinvoiceloading'(currentyear,nextyear){
       if (Roles.userIsInRole(Meteor.userId(), 'admin')){
          var sort_order = {};
          sort_order["Txn_Posted_Date"] = 1;
         var accountusers = Users.find(
           {
             "roles" : "Accounts"
           },{ 
             "fields":{ _id: 1}}
           ).fetch();
         var locs = accountusers.map(function(x) { return x._id } );
         return Csvdata.collection.find({
                        $and: [{  
                            "invoice_no" : { $ne:"not_assigned" }
                             }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(currentyear),
                                $lt: new Date(nextyear)
                              }
                              },{
                            "Cr/Dr": "DR"
                             },{
                            "Assigned_user_id":{ "$in": locs }
                             }]
                          }, {
                        sort: sort_order
                     }).fetch();
                   }
       else {
          throw new Meteor.Error(403, "Access denied");
       }
    },

    'userupdate'(id, address, username,role){
      console.log(id);console.log(address);console.log(username);
      if(Meteor.isServer){
       if (Roles.userIsInRole(Meteor.userId(), 'admin') || Meteor.userId()==id) {
           Meteor.users.update(
            {_id: id }, 
            {
              $set: 
                 {
                  'emails.0.address': address,
                  "username": username,
                  "roles.0": role,
                  "profile.email": address,
                  "profile.name": username,
                  "profile.role": role
                }
             });
         } 
         else {
             throw new Meteor.Error(403, "Access denied");
         }
      }
    },

    'removeUser' (user) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            check(user._id, String);
            Meteor.users.remove(user._id);
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'removeTransaction' (id) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            check(id, String);
             Csvdata.remove(id);
        } else {
            throw new Meteor.Error(403, "Access denied");
        }
    },

    'changePasswordForce' (userId, newPassword) {
        if (Meteor.isServer) {
            if (userId === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Accounts.setPassword(userId, newPassword);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'assignTransDocToUser' (docid, userid, username) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Csvdata.update({
                    "_id": docid
                }, {
                    $set: {
                        "Assigned_user_id": userid,
                        "Assigned_username": username
                    }
                });
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'Subcategory_remove' (subcategory_id) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Subcategory.remove({
                    "parent_id": subcategory_id
                });
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'Category_remove' (id) {
        if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Productcategory.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },

    'head_remove'(id){
           if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Head.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },
    'Account_remove'(id){
             if (Meteor.isServer) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Accounts_no.remove(id);
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        }
    },
    'sendEmail'(to, from, subject, text){
       if (Meteor.isServer) {
        check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
       // without waiting for the email sending to complete.
          // this.unblock();
          Email.send({
            "headers": {
                  'Content-Type': 'text/html; charset=UTF-8'
                     },
            to: to,
            from: from,
            subject: subject,
            text: text
        });
      }
     },
     'remindercsvdata'(user_id){
         if(Meteor.isServer){
           return Csvdata.find({$and: [{"Assigned_user_id": user_id},{"invoice_description": "invoice_description"}]}); 
         }
         else{
           throw new Meteor.Error(403, "Access denied");
         }
     }
    });