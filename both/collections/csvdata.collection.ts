import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Csvdata = new Mongo.Collection('csvdata');

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
//       Csvdata.insert( item );  
//       Csvdata.save({"Transaction ID": item["Transaction ID"],item});  
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
                 "Available_Balance(INR)":item["Available Balance(INR)"]
             }); 
      }
    }
    return true;
  }
});