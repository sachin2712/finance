// This component is used to show list of all transaction notes whose invoice is attached now

import {
    Component,
    OnInit,
    NgZone
} from '@angular/core';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
import {
    Router
} from '@angular/router';
import {
    Meteor
} from 'meteor/meteor';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MeteorObservable
} from 'meteor-rxjs';
import {
    Mongo
} from 'meteor/mongo';
import * as _ from 'lodash';
import * as moment from 'moment';
import template from './completeinvoices.html';

@Component({
    selector: 'completeinvoice',
    template
})
@InjectUser('user')
export class CompleteInvoices implements OnInit {
    user: Meteor.User;
    monthwiselist: any;
    loading: boolean= false;
    locationurl: any;
    date: any;
    currentyear: any;
    currentyearsearch: any;
    nextyear: any;
    nextyearsearch: any;
    allPendingInvoicesData: any;
    monthvalue: any;
    yearvalue: any;
    month: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"]; 
    constructor( private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
        this.loading=true;
        this.locationurl = window.location.origin;
        this.date = moment(localStorage.getItem("Selected_financial_year"));
        this.monthvalue = this.date.month()+1;
        this.yearvalue = this.date.year();
        this.currentyear = parseInt(this.date.format('YYYY'));
        if(parseInt(this.date.format('MM')) > 3)
        {    
             this.currentyearsearch = '04-01-'+this.currentyear;
             this.nextyear = this.currentyear + 1;
             this.nextyearsearch = '04-01-'+ this.nextyear;
        }
        else{
             this.nextyear = this.currentyear;
             this.nextyearsearch = '04-01-'+ this.nextyear;
             this.currentyearsearch = '04-01-'+ --this.currentyear;      
        }
        this.loadPendingInvoices(this.currentyearsearch,this.nextyearsearch);
    } 

    loadPendingInvoices(currentyear,nextyear){
        this.loading=true;
        MeteorObservable.call("completeinvoiceloading",currentyear,nextyear).subscribe(
          (response) => {
              var self=this;
            self.ngZone.run(() => {
                 // console.log(response);
                  self.allPendingInvoicesData=response;
                  self.extractMonthWiseData();
                  self.loading=false;
             });
          }, (err) => {
            console.log(err);
        });
    }

    extractMonthWiseData(){
         let monthlist = {};
         for (var i = 0; i < this.allPendingInvoicesData.length; i++) {
              let item = this.allPendingInvoicesData[i];
              let d = new Date(item["Txn_Posted_Date"]);
              let year = d.getFullYear();
              let month_value = d.getMonth();
              let key = this.month[month_value];
                if (!monthlist[key]) {
                          monthlist[key] = [];
                        }
                   monthlist[key].push(item);
             }

             let list = [];
             _.forEach(monthlist, function(value, key) {
                  list.push({
                     "key": key,
                     "value": value
                    })
              })
              this.monthwiselist = list;
              this.loading=false;
              // console.log(this.monthwiselist);
    }

    YearMinus(){
           this.nextyear = this.currentyear;
           this.nextyearsearch = '04-01-'+ this.nextyear;
           this.currentyearsearch = '04-01-'+ --this.currentyear;
           this.loading=true;
           this.loadPendingInvoices(this.currentyearsearch,this.nextyearsearch);
    }

    YearPlus(){
           this.currentyearsearch = '04-01-'+ ++this.currentyear;
           this.nextyear = ++this.nextyear;
           this.nextyearsearch = '04-01-'+ this.nextyear;
           this.loading=true;
           this.loadPendingInvoices(this.currentyearsearch,this.nextyearsearch);     
    }
}