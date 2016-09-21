import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Csvdata = new Mongo.Collection('csvdata');
export const Productcategory = new Mongo.Collection('Productcategory');

Meteor.users.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
      });


Meteor.methods({
 'parseUpload'( data ) {
    check( data, Array );

    for ( let i = 0; i < data.length; i++ ) {
      var item   = data[ i ];
      if(item["Transaction ID"]=='')
      {
          continue;
      }
      let exists:any;
      exists = Csvdata.findOne( { "Transaction_ID": item["Transaction ID"] } );

      if ( exists ) { 
         Csvdata.update({"Transaction_ID": item["Transaction ID"]},
         { $set:{"No":item["No."],
                 "Value_Date":item["Value Date"],
                 "Txn_Posted_Date":new Date(item["Txn Posted Date"]),
                 "ChequeNo":item["ChequeNo."],
                 "Description":item["Description"],
                 "Cr/Dr":item["Cr/Dr"],
                 "Transaction_Amount(INR)":item["Transaction Amount(INR)"],
                 "Available_Balance(INR)":item["Available Balance(INR)"]}});
        console.log( 'transaction id :'+item["Transaction ID"]+'with no:'+item["No."]+' is updating document !!!! ' );
      } 
      else {
         Csvdata.insert({
                 "No":item["No."],
                 "Transaction_ID": item["Transaction ID"],
                 "Value_Date":item["Value Date"],
                 "Txn_Posted_Date": new Date(item["Txn Posted Date"]),
                 "ChequeNo":item["ChequeNo."],
                 "Description":item["Description"],
                 "Cr/Dr":item["Cr/Dr"],
                 "Transaction_Amount(INR)":item["Transaction Amount(INR)"],
                 "Available_Balance(INR)":item["Available Balance(INR)"],
                 "Assigned_category": "not assigned",
                 "is_processed": 0,
                 "invoice_no":"not_assigned",
                 "invoice_description":"invoice_description"
             }); 
      }
    }
    return true;
  },// Meteor method addcategory will assign category to our document which we choose in csvjson component
  'addcategory'(id,category){
       check( id, String );
       check( category, String );
       Csvdata.update({"_id": id},{ $set:{ "Assigned_category":category,"is_processed":1}});
  },
  'changecategory'(id,category){
       check( id, String );
       check( category, String );
       Csvdata.update({"_id": id},{ $set:{ "Assigned_category":category}});
  },
  'addInvoice'(id,invoice_no,description){
      check(id,String);
      check(invoice_no,String);
      check(description,String);
      console.log(id + invoice_no + description);
      Csvdata.update({"_id": id},{ $set:{"invoice_no":invoice_no,"invoice_description":description}});
   
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