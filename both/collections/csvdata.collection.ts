import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
export const Csvdata = new Mongo.Collection('csvdata');
export const Productcategory = new Mongo.Collection('Productcategory');

Meteor.users.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
      });
Productcategory.allow({
      insert: function () { 
        if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
        },
      update: function () { 
      if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
         },
      remove: function () { 
      if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
            return true;
        }
        else{
            return false;
        }
         }
});
Csvdata.allow({
      insert: function () { return true; },
      update: function () { return true; },
      remove: function () { return true; }
});
Meteor.methods({
 'parseUpload'( data, categoryarray ) {
    check( data, Array );
    console.log(categoryarray);
      var category="not assigned";
       var is_processed=0;       
//       var str = item["Description"];
       var n=0;
//    check(categoryarray, Array);
    for ( let i = 0; i < data.length; i++ ) {
      var item   = data[ i ];
//      **** automatic category apply code ****
       category="not assigned";
       is_processed=0;       
       var str = item["Description"];
//       n=-1;
    
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
          
   
    for(let i=0;i<categoryarray.length;i++){
//       var str = "BIL/001021344935/joshita/90072010200372";
         console.log('---------------------------');
          n = str.indexOf(categoryarray[i].category);
          console.log(categoryarray[i].category);
          console.log(str);
          console.log(n);
        if(n!=-1){
          category=categoryarray[i].category;
          is_processed=1;
            console.log(category);
            console.log(is_processed);
            break;
           }else{
          category="not assigned";
          is_processed=0;
           }    
           console.log(i);
        }
       console.log(category);
    
//    document.getElementById("demo").innerHTML = n;
          
          
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
                 "Assigned_category": category,
                 "is_processed": is_processed,
                 "invoice_no":"not_assigned",
                 "invoice_description":"invoice_description",
                 "Assigned_user_id":"not_assigned",
                 "Assigned_username":"not_assigned"
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
  'addInvoice'(id,invoice_no,description,linkarray){
      check(id,String);
      check(invoice_no,String);
      check(description,String);
      console.log(id + invoice_no + description);
      console.log(linkarray);
      Csvdata.update({"_id": id},{ $set:{"invoice_no":invoice_no,"invoice_description":description,"linktodrive":linkarray}});
   
  },
  'deleteinvoice'(id){
      check(id,String);
      Csvdata.update({"_id": id},{ $set:{"invoice_no":"not_assigned","invoice_description":"invoice_description","linktodrive":"notassigned"}});
  },
  'adduser'(adduserinfo){
     check(adduserinfo.username, String);
     check(adduserinfo.email, String);
     check(adduserinfo.password, String);
     console.log(adduserinfo);
     if (Meteor.isServer) {
        if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
     let userid=Accounts.createUser(adduserinfo);
     console.log(userid);
     Roles.addUsersToRoles( userid, [adduserinfo.profile.role] );
        }
        else{
             throw new Meteor.Error(403, "Access denied");
        }
     }
     
  },
  'removeuser'(user){
      if(Roles.userIsInRole( Meteor.userId(), 'admin' ))
      {
      check(user._id,String);
      Meteor.users.remove(user._id);
      }
      else {
           throw new Meteor.Error(403, "Access denied");
      }
      
  },
  'changepasswordforce'(userId,newPassword){
//      check(id,String);
      console.log(userId);
      console.log(newPassword);
     if (Meteor.isServer) {
         if(userId===Meteor.userId() || Roles.userIsInRole( Meteor.userId(), 'admin' )){
      Accounts.setPassword(userId,newPassword);
         }else{
             throw new Meteor.Error(403, "Access denied");
         }
       }
  },
  'assigntransdoctouser'(docid,userid,username){
      if(Meteor.isServer){
           if(Roles.userIsInRole( Meteor.userId(), 'admin' )){
           Csvdata.update({"_id": docid},{ $set:{"Assigned_user_id":userid,"Assigned_username":username}});
           }
           else{
               throw new Meteor.Error(403, "Access denied");
           }
           
      }
  }
  
});
