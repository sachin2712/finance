import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
// *** new pattern***
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MeteorObservable
} from 'meteor-rxjs';
import * as _ from 'lodash';
import {
    Csvdata,
    Head
} from '../../../../both/collections/csvdata.collection';
import template from './expenseReport.html';

@Component({
    selector: 'expensereport',
    template
})

export class ExpenseReportComponent implements OnInit, OnDestroy {
 csvdata1: Observable < any[] > ;
 csvdata: any;
 csvSub: Subscription;

 monthwiselist: any;

 expense_id: any;
 expense: Observable < any[] > ;
 headSub: Subscription;
constructor(private _router: Router) { }

ngOnInit() {
  var sort_order = {};
  sort_order["Txn_Posted_Date"] = 1;
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
          this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        //**** time limit check condition
        if (localStorage.getItem("login_time")) {
            var login_time = new Date(localStorage.getItem("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                localStorage.removeItem('login_time');
                localStorage.removeItem('Meteor.loginToken');
                localStorage.removeItem('Meteor.loginTokenExpires');
                localStorage.removeItem('Meteor.userId');
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
        }

        this.expense = Head.find({"head": "Expense"});
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.expense.subscribe((data)=>{
            this.expense_id = data[0]? data[0]._id: '';
            if(this.expense_id){
                this.csvdata1 = Csvdata.find({"Assigned_head_id":this.expense_id},{ sort: sort_order }).zone();
                this.csvdata1.subscribe((data1) => {
                this.csvdata = data1;
                // this.loading = false;
                // var big=[];
                var monthlist=[];
               for(let i=0;i<this.csvdata.length;i++){
                   var item = this.csvdata[i];
                   var d = new Date(item["Txn_Posted_Date"]);
                   var year = d.getFullYear();
                   var month_value = d.getMonth();
                   var key=month[month_value]+'-'+year;
                   if(!monthlist[key]){
                       monthlist[key]=[];
                   }
                   // var insert = {};
                   // insert[key]=item;
                   monthlist[key].push(item);
               } 
               this.monthwiselist=monthlist;
              //    _.forEach(monthlist, function(value){
              //     console.log(value);
              //     this.monthwiselist.push(value);
              // });
               // this.monthwiselist.push(...monthlist);
               console.log(this.monthwiselist);
               console.log(this.monthwiselist.length);
               
              });
                // console.log(this.monthwiselist);
                
            } 
        });
       
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe(); 
        this.headSub.unsubscribe(); 
    }
}