import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    MongoObservable
} from 'meteor-rxjs';
import {
    check
} from 'meteor/check';
import {
    Accounts
} from 'meteor/accounts-base';
export const Csvdata = new MongoObservable.Collection('csvdata');
export const Productcategory = new MongoObservable.Collection('Productcategory');
// *** Graphdata will store month wise info of CR and DR ***
export const Graphdata = new MongoObservable.Collection('graphdata');
export const Users = MongoObservable.fromExisting(Meteor.users);

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
    'parseUpload' (data, categoryarray) {
        check(data, Array);
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
        for (let i = 0; i < data.length; i++) {
            var item = data[i];

            if (item["Transaction ID"] == '') {
                continue;
            }
            let exists: any;
            let exists_graph: any;
            let d: any = new Date(item["Txn Posted Date"]);
            let year: number = d.getFullYear();
            let month_value: number = d.getMonth();
            let amount: number = parseInt(item["Transaction Amount(INR)"]);
            let old_Transaction_value: number = 0;
            // **** in exists_graph we are checking if our we have document for that year or not ****
            exists_graph = Graphdata.findOne({
                "year": year
            });
            exists = Csvdata.findOne({
                "Transaction_ID": item["Transaction ID"]
            });

            // **** In case we are updating our csvdata valules we will use this part **** 
            if (exists) {
                Csvdata.update({
                    "Transaction_ID": item["Transaction ID"]
                }, {
                    $set: {
                        "No": item["No."],
                        "Value_Date": item["Value Date"],
                        "Txn_Posted_Date": new Date(item["Txn Posted Date"]),
                        "ChequeNo": item["ChequeNo."],
                        "Description": item["Description"],
                        "Cr/Dr": item["Cr/Dr"],
                        "Transaction_Amount(INR)": amount,
                        "Available_Balance(INR)": item["Available Balance(INR)"]
                    }
                });
                // **** here we incremnet and decremnet depend on exists****              
                old_Transaction_value = parseInt(exists["Transaction_Amount(INR)"]);
                let obj = {};
                if (item["Cr/Dr"] == "CR") {
                    amount = amount - old_Transaction_value;
                    obj[month[month_value] + '_CR'] = amount;
                } else {
                    amount = amount - old_Transaction_value;
                    obj[month[month_value] + '_DR'] = amount;
                }
                Graphdata.update({
                    "year": year
                }, {
                    $inc: obj
                });

                console.log('transaction id :' + item["Transaction ID"] + 'with no:' + item["No."] + ' is updating document !!!! ');
            }
            // *** In case our csvdata is new *** 
            else {
                Csvdata.insert({
                    "No": item["No."],
                    "Transaction_ID": item["Transaction ID"],
                    "Value_Date": item["Value Date"],
                    "Txn_Posted_Date": new Date(item["Txn Posted Date"]),
                    "ChequeNo": item["ChequeNo."],
                    "Description": item["Description"],
                    "Cr/Dr": item["Cr/Dr"],
                    "Transaction_Amount(INR)": amount,
                    "Available_Balance(INR)": item["Available Balance(INR)"],
                    "Assigned_category": "not assigned",
                    "is_processed": 0,
                    "invoice_no": "not_assigned",
                    "invoice_description": "invoice_description",
                    "Assigned_user_id": "not_assigned",
                    "Assigned_username": "not_assigned"
                });
                if (exists_graph) {
                    var obj = {};
                    if (item["Cr/Dr"] == "CR") {
                        obj[month[month_value] + '_CR'] = amount;
                    } else {
                        obj[month[month_value] + '_DR'] = amount;
                    }

                    Graphdata.update({
                        "year": year
                    }, {
                        $inc: obj
                    });

                } else {
                    var obj = {};
                    if (item["Cr/Dr"] == "CR") {
                        obj[month[month_value] + '_CR'] = amount;
                    } else {
                        obj[month[month_value] + '_DR'] = amount;
                    }
                    Graphdata.insert({
                        "year": year,
                        "January_CR": 0,
                        "February_CR": 0,
                        "March_CR": 0,
                        "April_CR": 0,
                        "May_CR": 0,
                        "June_CR": 0,
                        "July_CR": 0,
                        "August_CR": 0,
                        "September_CR": 0,
                        "October_CR": 0,
                        "November_CR": 0,
                        "December_CR": 0,
                        "January_DR": 0,
                        "February_DR": 0,
                        "March_DR": 0,
                        "April_DR": 0,
                        "May_DR": 0,
                        "June_DR": 0,
                        "July_DR": 0,
                        "August_DR": 0,
                        "September_DR": 0,
                        "October_DR": 0,
                        "November_DR": 0,
                        "December_DR": 0
                    });

                    Graphdata.update({
                        "year": year
                    }, {
                        $inc: obj
                    });
                }


            }
        }
        return true;
    }, // Meteor method addcategory will assign category to our document which we choose in csvjson component

    'addCategory' (id, category) {
        check(id, String);
        check(category, String);
        Csvdata.update({
            "_id": id
        }, {
            $set: {
                "Assigned_category": category,
                "is_processed": 1
            }
        });
    },
    'changeCategory' (id, category) {
        check(id, String);
        check(category, String);
        Csvdata.update({
            "_id": id
        }, {
            $set: {
                "Assigned_category": category
            }
        });
    },
    'addInvoice' (id, invoice_no, description, linkarray) {
        check(id, String);
        check(invoice_no, String);
        check(description, String);
        Csvdata.update({
            "_id": id
        }, {
            $set: {
                "invoice_no": invoice_no,
                "invoice_description": description,
                "linktodrive": linkarray
            }
        });
    },
    'deleteInvoice' (id) {
        check(id, String);
        Csvdata.update({
            "_id": id
        }, {
            $set: {
                "invoice_no": "not_assigned",
                "invoice_description": "invoice_description",
                "linktodrive": "notassigned"
            }
        });
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
    'removeUser' (user) {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
            check(user._id, String);
            Meteor.users.remove(user._id);
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
    }

});
