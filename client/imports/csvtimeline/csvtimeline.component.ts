import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Csvdata,Productcategory }   from '../../../both/collections/csvdata.collection';

import template from './csvtimeline.html';
 

@Component({
  selector: 'csvtimeline',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class CsvTimelineComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;
  productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
  
  ngOnInit() {
       var sort_order={};
       sort_order["Txn_Posted_Date"]=-1;
    this.csvdata = Csvdata.find({},{sort:sort_order});
    this.productcategory=Productcategory.find();
  }
  changecategory(id,category){
        Meteor.call('changecategory',id,category,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
    }

  
}

