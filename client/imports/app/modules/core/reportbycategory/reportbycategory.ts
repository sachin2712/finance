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
    Accounts_no,
    Subcategory
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './reportbycategory.html';

@Component({
    selector: 'reportbycategory',
    template
})

export class ReportByCategoryComponent implements OnInit, OnDestroy {
    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;

    account_code: any; // use for showing last 4 digit of account


    categoryfound: any;
    categoryobservable: Observable < any[] > ;
    categorylist: any;
    categorySub: Subscription;

    subcategoryobservable: Observable < any[] > ;
    subcategorylist: any;
    subcategorySub: Subscription;
    selectedsubcategorylist: any;
    selectedsubcategory: any;
    callingparent: string;

    monthwiselist: any;
    monthwisetotal: any;
    selectedcategory: any;

    accountlist: Observable < any[] > ;
    accountSub: Subscription;
    accountlistdata: any;

    loading: boolean = false;
    expense_id: any;
    headreport: Observable < any[] > ;
    headlist: any;
    headSub: Subscription;
    headname: any;
    exporttext: any;

    // data related declaration
    date: any;
    monthvalue: any;
    yearvalue: any;
    currentmonth: any;
    nextmonth: any;
    displaymonthyear: string;
    toggleyearmonth: boolean=false;

    currentyear: any;
    currentyearsearch: any;
    nextyear: any;
    nextyearsearch: any;
    month: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    constructor(private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();

        this.date = moment();
        this.currentmonth = moment().date(1);
        this.displaymonthyear = moment().format('MMMM YYYY');
        this.nextmonth=moment().date(1).add(1,'months');

        this.monthvalue = this.date.month() + 1;
        this.yearvalue = this.date.year();

        this.currentyear = parseInt(this.date.format('YYYY'));
        if (parseInt(this.date.format('MM')) > 3) {
            this.currentyearsearch = '04-01-' + this.currentyear;
            this.nextyear = this.currentyear + 1;
            this.nextyearsearch = '04-01-' + this.nextyear;
        } else {
            this.nextyear = this.currentyear;
            this.nextyearsearch = '04-01-' + this.nextyear;
            this.currentyearsearch = '04-01-' + --this.currentyear;
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
            } else {
                localStorage.setItem("login_time", current_time.toString());
            }
        }

        this.headreport = Head.find({}).zone();
        this.headreport.subscribe((data) => {
            this.ngZone.run(() => {
                this.headlist = data;
            });
        });

        this.accountlist = Accounts_no.find({}).zone();
        this.accountlist.subscribe((data) => {
            this.accountlistdata = data;
        });

        this.categoryobservable = Productcategory.find({}).zone();
        this.categoryobservable.subscribe((data) => {
            this.categorylist = data;
        });

        this.subcategoryobservable = Subcategory.find({}).zone();
        this.subcategoryobservable.subscribe((data) => {
            this.subcategorylist = data;
        });
    }

    searchhead(selectedbyuser) {
        this.selectedcategory = selectedbyuser;
        this.selectedsubcategorylist = _.filter(this.subcategorylist, {
            "parent_id": selectedbyuser._id
        });
        this.selectedsubcategory = null;
        this.callingparent = "parentsearch";
         if(this.toggleyearmonth){
             this.startsearchreportbycategorymonth();
           }
       else {
              this.startsearchreportbycategory(); 
            } 
    }

    subcategorySearchHead(selectedsubcategorybyuser) {
        this.selectedsubcategory = selectedsubcategorybyuser;
        this.callingparent = "subcategorysearch";
         if(this.toggleyearmonth){
             this.startsearchreportbycategorymonth();
           }
       else {
              this.startsearchreportbycategory(); 
            } 
    }

    startsearchreportbycategory() {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.loading = true;
        if (this.callingparent == "parentsearch" && this.selectedcategory) {
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_parent_id": this.selectedcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentyearsearch),
                        $lt: new Date(this.nextyearsearch)
                    }
                }]
            }, {
                sort: sort_order
            }).zone();
        } else if(this.selectedsubcategory) {
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_category_id": this.selectedsubcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentyearsearch),
                        $lt: new Date(this.nextyearsearch)
                    }
                }]
            }, {
                sort: sort_order
            }).zone();
        }

        this.monthwiselist = null;
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
                item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
                var key = this.month[month_value];
                if (!monthlist[key]) {
                    monthlist[key] = [];
                }
                if (!monthtotal[key]) {
                    monthtotal[key] = 0;
                }
                monthlist[key].push(item);
                monthtotal[key] += Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
            }
            var list = [];
            _.forEach(monthlist, function(value, key) {
                list.push({
                    "key": key,
                    "value": value
                })
            })
            this.loading = false;
            this.monthwisetotal = monthtotal;
            this.monthwiselist = list;
            // console.log(this.monthwiselist);
        });
        var self = this;
        setTimeout(function() {
            self.loading = false;
        }, 2000);
    }

    startsearchreportbycategorymonth() {
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.loading = true;
        if (this.callingparent == "parentsearch" && this.selectedcategory) {
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_parent_id": this.selectedcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
                        $lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
                    }
                }]
            }, {
                sort: sort_order
            }).zone();
        } else if(this.selectedsubcategory) {
            this.csvdata1 = Csvdata.find({
                $and: [{
                    "Assigned_category_id": this.selectedsubcategory._id
                }, {
                    "Txn_Posted_Date": {
                        $gte: new Date(this.currentmonth.format('MM-DD-YYYY')),
                        $lt: new Date(this.nextmonth.format('MM-DD-YYYY'))
                    }
                }]
            }, {
                sort: sort_order
            }).zone();
        }

        this.monthwiselist = null;
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
                item["Assigned_Category"] = this.categoryfound[0] ? this.categoryfound[0].category : 'Not Assigned';
                var key = this.month[month_value];
                if (!monthlist[key]) {
                    monthlist[key] = [];
                }
                if (!monthtotal[key]) {
                    monthtotal[key] = 0;
                }
                monthlist[key].push(item);
                monthtotal[key] += Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
            }
            var list = [];
            _.forEach(monthlist, function(value, key) {
                list.push({
                    "key": key,
                    "value": value
                })
            })
            this.loading = false;
            this.monthwisetotal = monthtotal;
            this.monthwiselist = list;
            // console.log(this.monthwiselist);
        });
        var self = this;
        setTimeout(function() {
            self.loading = false;
        }, 2000);
    }

    monthtotalformat(months) {
        return accounting.formatNumber(this.monthwisetotal[months], " ");
    }

    accountprint(id) {
        this.account_code = _.filter(this.accountlistdata, {
            "_id": id
        });
        return this.account_code[0] ? this.account_code[0].Account_no.slice(-4) : "processing";
    }

    headnamebyid(id) {
        this.headname = _.filter(this.headlist, {
            "_id": id
        });
        return this.headname[0] ? this.headname[0].head : "not assigned";
    }

    printfunction() {
        window.print();
    }

    toggleMonthYear() {
      console.log("toggle function is called");
      this.ngZone.run(() => {
      this.toggleyearmonth=!this.toggleyearmonth;
      if(this.selectedcategory || this.selectedsubcategory){
      if(this.toggleyearmonth){
             this.startsearchreportbycategorymonth();
           }
       else {
              this.startsearchreportbycategory(); 
            }   
        } 
       });
    }

    monthPlus() {
       console.log("monthplus is called");
       this.currentmonth = this.currentmonth.add(1,'months');
       this.nextmonth=this.nextmonth.add(1,'months');
       this.displaymonthyear=this.currentmonth.format('MMMM YYYY');
       this.startsearchreportbycategorymonth();
    }

    monthMinus() {
       console.log("month minus is called");
       this.nextmonth=this.nextmonth.subtract(1,'months');
       this.currentmonth = this.currentmonth.subtract(1,'months');
       this.displaymonthyear=this.currentmonth.format('MMMM YYYY');
       this.startsearchreportbycategorymonth();
    }

    YearMinus() {
        this.nextyear = this.currentyear;
        this.nextyearsearch = '04-01-' + this.nextyear;
        this.currentyearsearch = '04-01-' + --this.currentyear;
        if (this.selectedcategory) {
            this.startsearchreportbycategory();
        }
    }

    YearPlus() {
        this.currentyearsearch = '04-01-' + ++this.currentyear;
        this.nextyear = ++this.nextyear;
        this.nextyearsearch = '04-01-' + this.nextyear;
        if (this.selectedcategory) {
            this.startsearchreportbycategory();
        }
    }

    exporttextfile(){
      this.exporttext="";
      if (this.callingparent == "parentsearch") {
          this.exporttext+="Month,Transaction date,Transaction Id,Description,Assigned Category,Assigned Head,Account Number,CR/DR,Transaction Amount \n";
             var self=this;
             _.forEach(self.monthwiselist, function(value, key) {
                 self.exporttext+=value["key"]+"\n";
                 _.forEach(value["value"], function(value1) {
                        self.exporttext+=","+moment(value1["Txn_Posted_Date"]).format("DD-MM-YY hh:mm:ss a")+","+value1["Transaction_ID"]+","+value1["Description"]+","+value1["Assigned_Category"]+","+self.headnamebyid(value1["Assigned_head_id"])+
                        ","+"******"+self.accountprint(value1["AssignedAccountNo"])+","+value1["Cr/Dr"]+","+value1["Transaction_Amount(INR)"]+"\n";
                      });
                 // console.log(self.exporttext);
            });
         }
         else {
              this.exporttext+="Month,Transaction date,Transaction Id,Description,Assigned Category,Assigned Subcategory,Assigned Head,Account Number,CR/DR,Transaction Amount \n";
              var self=this;
               _.forEach(self.monthwiselist, function(value, key) {
                 self.exporttext+=value["key"]+"\n";
                 _.forEach(value["value"], function(value1) {
                        self.exporttext+=","+moment(value1["Txn_Posted_Date"]).format("DD-MM-YY hh:mm:ss a")+","+value1["Transaction_ID"]+","+value1["Description"]+","+value1["Assigned_Category"]+","+self.selectedsubcategory.category+","+self.headnamebyid(value1["Assigned_head_id"])+
                        ","+"******"+self.accountprint(value1["AssignedAccountNo"])+","+value1["Cr/Dr"]+","+value1["Transaction_Amount(INR)"]+"\n";
                      });
                    // console.log(self.exporttext);
                  });
         }
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.headSub.unsubscribe();
        this.categorySub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.accountSub.unsubscribe();
    }
}
