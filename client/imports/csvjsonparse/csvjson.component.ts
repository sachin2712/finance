import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Csvdata,Productcategory }   from '../../../both/collections/csvdata.collection';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';

import template from './csvjsoncomponent.html';
 

@Component({
  selector: 'csvjson',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})

export class CsvJsonComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;// this is for csv data collection
  productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
  id:any;// id is used in addtocategory funciton that stores the id of document whose category we want to change 
  category:any;//category will store string category that we want to assign to any doucment 
  successmessage: string;
  messageshow: boolean=true;
  addForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {}
  
  ngOnInit() {
    // this is for showing only those transactions whose category is not assigned 
    this.csvdata = Csvdata.find({
        "is_processed":0
    });
    // this will sort all our category in alphabetical order
     var product_order={};
     product_order["category"]=1;
     this.productcategory=Productcategory.find({},{sort:product_order});  
     
     this.addForm = this.formBuilder.group({
      category: ['', Validators.required],
    }); 
  }
  
   resetForm() {
    this.addForm.controls['category']['updateValue']('');
  }
  
  addNewCategory(){
     if(this.addForm.valid){
         console.log(this.addForm.value);
         Productcategory.insert(this.addForm.value);
         
         // to empty the input box
         this.resetForm();
     }
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

