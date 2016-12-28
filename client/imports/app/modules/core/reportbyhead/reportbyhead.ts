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
    Head,
    Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './reportbyhead.html';

@Component({
    selector: 'byreporthead',
    template
})

export class ReportByHeadComponent implements OnInit, OnDestroy {
    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;


    categoryfound: any;
    categoryobservable: Observable < any[] > ;
    categorylist: any;
    categorySub: Subscription;
    
    monthwiselist: any;
    monthwisetotal: any;
    selectedhead: any;

    loading: boolean= false;
    expense_id: any;
    headreport: Observable < any[] > ;
    headSub: Subscription;
     month: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"]; 
      
    constructor(private _router: Router) {}

    ngOnInit() {
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
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
        this.headreport = Head.find({ });
        this.categoryobservable = Productcategory.find({}).zone();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.categoryobservable.subscribe((data) => {
            this.categorylist = data;
        });    
    }
       
        searchhead(headselectedbyuser){
            this.selectedhead=headselectedbyuser;
            console.log(this.selectedhead);
            this.startsearchreportbyhead();
        }
        startsearchreportbyhead(){
          console.log("calling startseachreport by head");
          var sort_order = {};
          sort_order["Txn_Posted_Date"] = -1;
          console.log(this.selectedhead._id);
          this.loading = true;             
          // this.headreport.subscribe((data) => {
            // this.expense_id = data[0] ? data[0]._id : '';
            // if (this.expense_id) {
                this.csvdata1 = Csvdata.find({
                    "Assigned_head_id": this.selectedhead._id
                }, {
                    sort: sort_order
                }).zone();
                this.csvdata1.subscribe((data1) => {
                    this.csvdata = data1;
                    var monthlist = {};
                    var monthtotal = {};
                    for (let i = 0; i < this.csvdata.length; i++) {
                        var item = this.csvdata[i];
                        var d = new Date(item["Txn_Posted_Date"]);
                        var year = d.getFullYear();
                        var month_value = d.getMonth();
                        this.categoryfound = _.filter(this.categorylist, {
                                 "_id": item["Assigned_parent_id"]
                         });
                        item["Assigned_Category"]=this.categoryfound[0]? this.categoryfound[0].category: 'Not Assigned';
                        var key = this.month[month_value] + '-' + year;
                        if (!monthlist[key]) {
                            monthlist[key] = [];
                        }
                        if(!monthtotal[key]){
                          monthtotal[key]=0;
                        }
                        monthlist[key].push(item);
                        monthtotal[key]+= Math.round(accounting.unformat(item["Transaction_Amount(INR)"])*100)/100;
                    }
                    var list = [];
                    _.forEach(monthlist, function(value, key) {
                        list.push({
                            "key": key,
                            "value": value
                        })
                    })
                    this.loading=false;
                    this.monthwisetotal=monthtotal;
                    this.monthwiselist = list;
                });
            // }
         // });
        }
    monthtotalformat(months) {
        return accounting.formatNumber(this.monthwisetotal[months], " ");
    }
     printfunction(){
        window.print();
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.headSub.unsubscribe();
    }
}