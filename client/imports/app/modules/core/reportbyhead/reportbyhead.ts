import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
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
import * as moment from 'moment';
import {
    Csvdata,
    Head,
    Productcategory,
     Accounts_no
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
    
    account_code: any;
    accountlist: Observable <any[]> ;
    accountSub: Subscription;
    accountlistdata: any;
    
    monthwiselist: any;
    monthwisetotal: any;
    selectedhead: any;

    loading: boolean= false;
    expense_id: any;
    headreport: Observable < any[] > ;
    headlist: any;
    headSub: Subscription;

    date: any;
    monthvalue: any;
    yearvalue: any;

    currentyear: any;
    currentyearsearch: any;
    nextyear: any;
    nextyearsearch: any;
    month: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"]; 
      
    constructor(private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.headreport = Head.find({ }).zone();
        this.headreport.subscribe((data) => {
            this.ngZone.run(() => {
            this.headlist=data;
          });
        });
        

        this.date = moment();
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
            else{
              localStorage.setItem("login_time", current_time.toString());
            }
        }
        
        this.categoryobservable = Productcategory.find({}).zone();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.categoryobservable.subscribe((data) => {
          this.ngZone.run(() => {
            this.categorylist = data;
          });
        });   

        this.accountlist = Accounts_no.find({}).zone();
        this.accountlist.subscribe((data) => {
          this.ngZone.run(() => {
             this.accountlistdata=data;
           });
        }); 
    }
       
        searchhead(headselectedbyuser){
            this.selectedhead=headselectedbyuser;
            this.startsearchreportbyhead();
        }
        startsearchreportbyhead(){
          var sort_order = {};
          sort_order["Txn_Posted_Date"] = 1;
          this.loading = true;   
          this.csvdata1 = Csvdata.find({
               $and: [{
                  "Assigned_head_id": this.selectedhead._id
                }, {
                  "Txn_Posted_Date": {
                             $gte: new Date(this.currentyearsearch),
                             $lt: new Date(this.nextyearsearch)
                      }
                 }]
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
                        var key = this.month[month_value];
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

    accountprint(id){
        this.account_code = _.filter(this.accountlistdata, {
                    "_id": id
             });
         return this.account_code[0]? this.account_code[0].Account_no.slice(-4): "not Assigned";
    }

    YearMinus(){
           this.nextyear = this.currentyear;
           this.nextyearsearch = '04-01-'+ this.nextyear;
           this.currentyearsearch = '04-01-'+ --this.currentyear;
           if(this.selectedhead){
                 this.startsearchreportbyhead();
           }  
    }

    YearPlus(){
           this.currentyearsearch = '04-01-'+ ++this.currentyear;
           this.nextyear = ++this.nextyear;
           this.nextyearsearch = '04-01-'+ this.nextyear;
           if(this.selectedhead){
                this.startsearchreportbyhead();
           }        
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.headSub.unsubscribe();
        this.categorySub.unsubscribe();
        // this.accountSub.unsubscribe();
    }
}