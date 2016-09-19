import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
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
    data_month: any;
    sort_order: any;
    month_in_headbar: any;
    yearly:any;
    monthly:any;
    dateB:any;
    dbdate:any;
    initialupperlimit:any;
   
     constructor(private _router:Router){ }
    
   
  ngOnInit() {
    //    **** for checking user is login or not ****  
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
    }
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
    sort_order["Txn_Posted_Date"]=-1;
//  *** all date related code ****
    this.data_month = moment();
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
    this.yearly=this.data_month.format('YYYY');
    this.monthly=this.data_month.format('MM');
    this.dateB = moment().year(this.yearly).month(this.monthly-1).date(1);
    this.dbdate=this.dateB.format('MM-DD-YYYY');
    this.initialupperlimit=this.data_month.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find({"Txn_Posted_Date":
        { 
            $gt : new Date(this.dbdate), 
            $lte: new Date(this.initialupperlimit) 
        }},
        {
        sort:sort_order
        }
      );
    this.productcategory=Productcategory.find({},{sort:product_order});
    this.data_month=this.dateB;
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
//  ******** incremented monthly data *****
  csvdatamonthlyplus(){
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
//  *** all date related code ****
       
    sort_order["Txn_Posted_Date"]=-1;
//  *** momentjs use ** 
    var incrementDateMoment = moment(this.data_month);
    incrementDateMoment.add(1, 'months');
    this.data_month=moment(incrementDateMoment);
    var data_month_temp=incrementDateMoment;
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
//  ***** here we need two months next and next to next ****
    var yearly=this.data_month.format('YYYY');
    var monthly=this.data_month.format('MM');
    var dateB = moment().year(yearly).month(monthly).date(1);
    var dbdatelower=this.data_month.format('MM-DD-YYYY');
    var dbdateupperlimit=dateB.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find(
        { "Txn_Posted_Date":{ 
            $gte : new Date(dbdatelower), 
            $lt : new Date(dbdateupperlimit)
             }},{
             sort:sort_order
             });     
  }
  csvdatamonthlyminus(){
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
//  *** all date related code ****
       
    sort_order["Txn_Posted_Date"]=-1;
    var dbdateprevious=this.data_month.format('MM-DD-YYYY');
      
    console.log(dbdateprevious);
    var decrementDateMoment = moment(this.data_month); 
    decrementDateMoment.subtract(1, 'months');
     
    this.data_month=decrementDateMoment;
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
//  ***** code to data retrive *****
    var yearly=this.data_month.format('YYYY');
    var monthly=this.data_month.format('MM');
    var dateB = moment().year(yearly).month(monthly-1).date(1);
    var dbdate=dateB.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find(
        {"Txn_Posted_Date":
            { 
                $gte : new Date(dbdate),
                $lt : new Date(dbdateprevious)
             }},
             {
             sort:sort_order
             });
  }
 
}


