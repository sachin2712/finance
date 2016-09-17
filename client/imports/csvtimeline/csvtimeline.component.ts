import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
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
//  var data_month = new Date();
   data_month: any;
   sort_order: any;
   month_in_headbar: any;
   year_in_headbar: any;
   month: any =["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  ngOnInit() {
       var sort_order={};
       var product_order={};
       product_order["category"]=1;
   let now = moment().format('LLLL');
   console.log("moment value check"+ this.now);
    sort_order["Txn_Posted_Date"]=-1;
    this.csvdata = Csvdata.find({},{sort:sort_order});
    this.productcategory=Productcategory.find({},{sort:product_order});
    this.data_month = new Date();
    this.month_in_headbar = this.month[this.data_month.getMonth()];
    console.log("month in headbar value"+this.month_in_headbar);
    this.year_in_headbar = this.data_month.getFullYear();
    console.log(this.data_month);
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
  csvdatamonthlyplus(){
      var d = new Date();
      d.setDate(d.getDate() + 30);   
      this.data_month.setDate(this.data_month.getDate() + 30);
      
      console.log(this.data_month);
      
      console.log(this.sort_order);
      this.csvdata = Csvdata.find({"Txn_Posted_Date":{ $gt : d
                               }});
                               console.log(this.csvdata);
      this.month_in_headbar = this.month[this.data_month.getMonth()];
      this.year_in_headbar = this.data_month.getFullYear();                         
      
      
  }
  csvdatamonthlyminus(){
      
      this.data_month.setDate(this.data_month.getDate() - 30);
      this.month_in_headbar = this.month[this.data_month.getMonth()];
      this.year_in_headbar = this.data_month.getFullYear();  
      console.log(this.data_month);
  }

  
}


