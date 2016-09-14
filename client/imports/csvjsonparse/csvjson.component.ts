import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Csvdata }   from '../../../both/collections/csvdata.collection';

import template from './csvjsoncomponent.html';
 

@Component({
  selector: 'csvjson',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class CsvJsonComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;
  successmessage: string;
  messageshow: boolean=true;
  ngOnInit() {
    this.csvdata = Csvdata.find();
    console.log(this.csvdata);
  }
   handleFiles() {
      // Check for the various File API support.
      var files = document.getElementById('files').files;
//      console.log("file is comming with"+ files);
//      console.log(files[0]);
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

  
}

