import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Csvdata,Productcategory }   from '../../../both/collections/csvdata.collection';

import template from './csvjsoncomponent.html';
 

@Component({
  selector: 'csvjson',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class CsvJsonComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;// this is for csv data collection
  productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
  id:any;// id is used in addtocategory funciton that stores the id of document whose category we want to change 
  category:any;//category will store string category that we want to assign to any doucment 
  successmessage: string;
  messageshow: boolean=true;
  
  
  ngOnInit() {
    this.csvdata = Csvdata.find({
        "is_processed":0
    });
    this.productcategory=Productcategory.find();
   
  }
   handleFiles() {
      // Check for the various File API support.
      var files = document.getElementById('files').files;

        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0],{
            header:true, 
            complete(results,file){
                Meteor.call('parseUpload',results.data,(error,response)=>{
                     if(error){                        
                       console.log(error.reason);
                        this.messageshow=true;
                       this.successmessage="Document Uploaded Sucessfully";
                     }      else {
                       console.log(response);
                       console.log("in response message is"+response);
                       this.messageshow=true;
                       this.successmessage="Document Uploaded Sucessfully";
                       
                     }
                 });
            }                  
        });

    }
    addcategory(id,category){
        Meteor.call('addcategory',id,category,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
        // in addcategory function we are assigning category to document which id is in id parameter
//        Csvdata.update({"_id": id},{ $set:{ "Assigned_category":category,"is_processed":1}});
    }

  
}

