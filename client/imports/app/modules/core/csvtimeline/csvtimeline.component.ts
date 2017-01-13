import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    NgZone
} from '@angular/core';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import * as moment from 'moment';
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
    TransactionComponent
} from './transactionComponent/transaction.component';
import { 
    NgForm 
} from '@angular/forms';
import {
    Csvdata,
    Productcategory,
    Subcategory,
    Head,
    Accounts_no
} from '../../../../../../both/collections/csvdata.collection';
import template from './csvtimeline.html';


@Component({
    selector: 'csvtimeline',
    template
})

export class CsvTimelineComponent implements OnInit, OnDestroy {
    upperlimit: any;
    lowerlimit: any;
    upperlimitstring: any;
    lowerlimitstring: any;
    month_parameter: any;
    year_parameter: any;
    parameterSub: Subscription;

    // ** loading variable 
    loading: boolean = false;
    accountlistloading: boolean = false;
    headarrayloading: boolean = false;
    parentcategoryloading: boolean = false;
    subcategoryloading: boolean = false;

    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;

    parentcategoryarray: any;
    productcategory: Observable < any[] > ;
    productSub: Subscription;

    subcategoryarray: any;
    subcategory: Observable < any[] > ;
    subcategorySub: Subscription;

    headarraylist: any;
    headarrayobservable: Observable < any[] > ;
    headarraySub: Subscription;

    headvalue: any;
    headobservable: Observable < any[] > ;
    headSub: Subscription;

    loginuser: any;
    loginrole: boolean; // *** will use for hide assigning label****

    sort_order: any;
    month_in_headbar: any;

    income_id: any;
    income: Observable < any[] > ;

    expense_id: any;
    expense: Observable < any[] > ;

    apply_filter: boolean = false;
    apply_cr_filter: boolean = false;
    apply_dr_filter: boolean = false;
    invoice_filter: boolean = false;
    apply_category_filter: boolean = false;
    apply_filter_unassign_year: boolean = false;
    // search active is use to check if we are searching for something
    // if we are searching for something then it will hide our next year previous year bar
    searchActive: boolean = false;

    Select_account: any;
    Selected_account_name: string;
    accountlist: Observable < any[] > ;
    accountSub: Subscription;
    accountlistdata: any;
    accountselected: string;
    accountfilter: boolean = false;

    limit: number=5;
    hideit: boolean=false;

    selectedCategory_id: any;
    selectedCategoryName: any;

    currentYearDate: any;
    nextYearDate: any;
    currentYearNumber: number;
    currentFinacialYear: any;

    constructor(private ngZone: NgZone, private _router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
         this.accountlistloading = true;
         this.headarrayloading = true;
         this.parentcategoryloading = true;
         this.subcategoryloading = true;

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
            else{
              localStorage.setItem("login_time", current_time.toString());
            }
        }

        //*** getting param values 
        this.parameterSub = this.route.params.subscribe(params => {
            this.month_parameter = +params['month']; // (+) converts string 'id' to a number
            this.year_parameter = +params['year'];
         
            // current finacialyear we use for searching in our timeline.
            if(this.month_parameter < 4){
                this.currentYearNumber = --this.year_parameter;
                this.currentYearDate = '04-01-'+this.currentYearNumber;
                this.nextYearDate = '04-01-'+ ++this.currentYearNumber;
                --this.currentYearNumber;
                ++this.year_parameter
            }
            else{
                this.currentYearNumber = this.year_parameter;
                this.currentYearDate = '04-01-'+this.currentYearNumber;
                this.nextYearDate = '04-01-'+ ++this.currentYearNumber;
                --this.currentYearNumber;
            }
            
            this.selectedCategory_id=null;
            this.selectedCategoryName='Select Category';
            this.apply_category_filter=false;
            this.loaddata();

            this.upperlimit = moment().year(this.year_parameter).month(this.month_parameter).date(1);
            this.upperlimitstring = this.upperlimit.format('MM-DD-YYYY');
            this.lowerlimit = moment().year(this.year_parameter).month(this.month_parameter - 1).date(1);
            this.month_in_headbar = this.lowerlimit.format('MMMM YYYY');
            this.lowerlimitstring = this.lowerlimit.format('MM-DD-YYYY');
            this.limit=5;
            this.hideit=false;
            this.monthdata(this.lowerlimitstring, this.upperlimitstring);
                // In a real app: dispatch action to load the details here.
        });
    }

    loaddata(){ // loading data at the time of component creation

        this.accountlist = Accounts_no.find({}).zone();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.accountlist.subscribe((data) => {
            this.ngZone.run(() => {
             this.accountlistdata=data;
             this.accountlistloading=false;
         });
        });

        this.headarrayobservable = Head.find({}).zone();
        this.headarraySub = MeteorObservable.subscribe('headlist').subscribe();
        this.headarrayobservable.subscribe((data) => {
            this.ngZone.run(() => {
            this.headarraylist = data;
            this.headarrayloading = false;
          });
        });
        
        this.income = Head.find({"head": "Income"});
        this.expense = Head.find({"head": "Expense"});

        // *** we are passing parent category and child category object as input to csvtimeline component child transaction ***
        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.ngZone.run(() => {
            this.parentcategoryarray = data;
            this.parentcategoryloading = false;
          });
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.ngZone.run(() => {
            this.subcategoryarray = data;
            this.subcategoryloading = false;
          });
        });

        this.income.subscribe((data) => {
             this.ngZone.run(() => {
             this.income_id = data[0]? data[0]._id: '';
           });
        });
        this.expense.subscribe((data)=>{
             this.ngZone.run(() => {
            this.expense_id = data[0]? data[0]._id: '';
          });
        });
    }

    //**** search function implementation 
    searchbox(form: NgForm){ 
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.searchActive=true;
        this.csvdata=null;
        if(!form.value.optionForSearch){
            form.value.optionForSearch="Desc";
        }
        if(form.value.optionForSearch=="Id"){
                   this.csvdata1 = Csvdata.find({
                        $and: [{  
                            "Transaction_ID" : form.value.searchvalue
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.currentYearDate),
                                $lt: new Date(this.nextYearDate)
                            }
                      }]
                   }, {
                 sort: sort_order
             }).zone();
        }
        else if(form.value.optionForSearch=="Amount"){
                  this.csvdata1 = Csvdata.find({
                        $and: [{  
                            "Transaction_Amount(INR)" : form.value.searchvalue
                        }, {
                            "Txn_Posted_Date": {
                               $gte: new Date(this.currentYearDate),
                               $lt: new Date(this.nextYearDate)
                            }
                      }]
                   }, {
                 sort: sort_order
             }).zone();
        }
        else if(form.value.optionForSearch=="Desc"){ 
                  this.csvdata1 = Csvdata.find({
                        $and: [{  
                            'Description': { '$regex' : new RegExp(form.value.searchvalue, "i")}
                        }, {
                            "Txn_Posted_Date": {
                               $gte: new Date(this.currentYearDate),
                               $lt: new Date(this.nextYearDate)
                            }
                      }]
                   }, {
                 sort: sort_order
             }).zone();
        }
        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);

    }
    //  ******** incremented monthly data *****
    csvDataMonthlyPlus() {
        this._router.navigate(['/csvtemplate/csvtimeline', this.upperlimit.format('MM'), this.upperlimit.format('YYYY')]);
    }

    csvDataMonthlyMinus() {
        this.lowerlimit.subtract(1, 'months');
        this._router.navigate(['/csvtemplate/csvtimeline', this.lowerlimit.format('MM'), this.lowerlimit.format('YYYY')]);
    }

    //*** increament year wise for category and unassigned filter
    csvYearMinus(){
         this.nextYearDate = '01-01-'+this.currentYearNumber;
         this.currentYearDate = '01-01-'+ --this.currentYearNumber;
        if(this.apply_category_filter){
              this.categoryFilterFucntion();
         }
         else if(this.apply_filter_unassign_year){
             this.unassignYearfilter();
         }   
    }
    csvYearPlus(){
         this.currentYearDate = '01-01-'+ ++this.currentYearNumber;
         this.nextYearDate = '01-01-'+ ++this.currentYearNumber;
         --this.currentYearNumber;
         if(this.apply_category_filter){
              this.categoryFilterFucntion();
         }
         else if(this.apply_filter_unassign_year){
             this.unassignYearfilter();
         }   
    }
    
    showExTransaction(){
        this.searchActive=false;
        this.monthdata(this.lowerlimitstring, this.upperlimitstring)
    }

    AccountSelected(Selected_account) {
        this.Select_account = Selected_account._id;
        this.Selected_account_name = Selected_account.Account_no;
        this.filterData();
    }

    categorySelected(selectedCat){
       this.selectedCategory_id=selectedCat._id;
       this.selectedCategoryName=selectedCat.category;
       this.categoryFilterFucntion();
    }

    monthdata(gte, lt) {
        this.loading = true;
        this.invoice_filter= false;
        var sort_order = {};
        var filter = {};
        sort_order["Txn_Posted_Date"] = 1;
        if (!this.apply_filter) {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        },{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }

            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        "Txn_Posted_Date": {
                            $gte: new Date(this.lowerlimitstring),
                            $lt: new Date(this.upperlimitstring)
                        }
                    }, {
                        sort: sort_order
                    }).zone();
                }

            }
        } else {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                //*** first filter 
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            }
        }
         setTimeout(()=> {
            this.loading = false;
        }, 3000);
        var self = this;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);
    }

    filter() {
        this.invoice_filter= false;
        this.apply_category_filter = false;
        this.selectedCategory_id=null;
        this.loading = true;
        this.apply_filter = !this.apply_filter;
        if(!this.apply_filter){
            this.apply_filter_unassign_year=false;
        }
        this.filterData();
    }
    CategoryFilter(){
        this.invoice_filter= false;
        this.apply_filter = false;
        this.apply_cr_filter = false;
        this.apply_dr_filter = false; 
        this.accountfilter = false;
        this.Select_account = null;
        this.Selected_account_name="Choose Account";
        this.apply_category_filter = !this.apply_category_filter;
        if(this.apply_category_filter)
        {   
            this.categoryFilterFucntion();
        } 
        if(!this.apply_category_filter){
          this.selectedCategory_id=null;
          this.selectedCategoryName='Select Category'; 
          this.filterData();
        }      
    }
    categoryFilterFucntion(){
         var sort_order = {};
       sort_order["Txn_Posted_Date"] = 1;
       if(this.apply_category_filter && this.selectedCategory_id){
            this.loading = true;
            this.csvdata1 = Csvdata.find({
                        $and: [{  
                            "Assigned_parent_id" : this.selectedCategory_id
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.currentYearDate),
                                $lt: new Date(this.nextYearDate)
                            }
                        }]
                    }, {
                        sort: sort_order
       }).zone();
        var self = this;
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);
     }
     else{
         this.filterData();
       }
     }   
    yearFilterUnassignedCalled(){
         this.apply_filter_unassign_year=!this.apply_filter_unassign_year;
         if(this.apply_filter_unassign_year){
             this.unassignYearfilter();
         }
         else{
            this.filterData(); 
         }
    }
    unassignYearfilter(){
       var sort_order = {};
       sort_order["Txn_Posted_Date"] = 1;
       if(this.apply_filter && this.apply_filter_unassign_year){
           this.loading = true;
           if(this.apply_cr_filter && !this.apply_dr_filter){
               this.csvdata1 = Csvdata.find({
                        $and: [{  
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.currentYearDate),
                                $lt: new Date(this.nextYearDate)
                            }
                        }]
                    }, {
                        sort: sort_order
              }).zone();
           }
           else if (!this.apply_cr_filter && this.apply_dr_filter){
               this.csvdata1 = Csvdata.find({
                        $and: [{  
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.currentYearDate),
                                $lt: new Date(this.nextYearDate)
                            }
                        }]
                    }, {
                        sort: sort_order
              }).zone();
           }
           else {
                this.csvdata1 = Csvdata.find({
                        $and: [{  
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.currentYearDate),
                                $lt: new Date(this.nextYearDate)
                            }
                        }]
                    }, {
                        sort: sort_order
              }).zone();
           }
        var self = this;
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);
     }
     else{
         this.filterData();
       }
    }

    filterDataCR() {
        this.invoice_filter= false;
        this.apply_category_filter = false;
        this.selectedCategory_id=null;
        this.loading = true;
        this.apply_cr_filter = !this.apply_cr_filter;
        if(this.apply_cr_filter && this.apply_filter_unassign_year){
            this.unassignYearfilter();
        }
        else if(!this.apply_cr_filter && this.apply_filter_unassign_year){
            this.unassignYearfilter();
        }
        else {
            this.filterData();
        }
    }

    filterDataDR() {
        this.invoice_filter= false;
        this.apply_category_filter = false;
        this.selectedCategory_id=null;
        this.loading = true;
        this.apply_dr_filter = !this.apply_dr_filter;
       if(this.apply_dr_filter && this.apply_filter_unassign_year){
            this.unassignYearfilter();
        }
        else if(!this.apply_dr_filter && this.apply_filter_unassign_year){
            this.unassignYearfilter();
        }
        else{
            this.filterData();
        }
    }

    filterAccount() {
        this.invoice_filter= false;
        this.apply_category_filter = false;
        this.selectedCategory_id=null;
        this.loading = true;
        this.accountfilter = !this.accountfilter;
        if (!this.accountfilter) {
            this.Select_account = null;
            this.Selected_account_name="Select Account";
        }
        this.filterData();
    }

    invoice_filters(){
       this.apply_filter = false;
       this.apply_cr_filter = false;
       this.apply_dr_filter = false; 
       this.accountfilter = false;
       this.Select_account = null;
       this.Selected_account_name="Choose Account";
       this.apply_category_filter = false;
       this.selectedCategory_id=null;
       this.invoice_filter = !this.invoice_filter;
       var sort_order = {};
       sort_order["Txn_Posted_Date"] = 1;
       if(this.invoice_filter){
        this.csvdata1 = Csvdata.find({
                        $and: [{  
                            "invoice_no" : { $ne:"not_assigned" }
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
       }).zone();
        var self = this;
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);
     }
     else{
         this.filterData();
       }
    }

    filterData() {
        this.invoice_filter = false;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        if (!this.apply_filter) {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        },{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }

            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        "Txn_Posted_Date": {
                            $gte: new Date(this.lowerlimitstring),
                            $lt: new Date(this.upperlimitstring)
                        }
                    }, {
                        sort: sort_order
                    }).zone();
                }

            }
        } else {
            if (this.apply_cr_filter && !this.apply_dr_filter) {
                //*** first filter 
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "CR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else if (!this.apply_cr_filter && this.apply_dr_filter) {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Cr/Dr": "DR"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            } else {
                if (this.accountfilter && this.Select_account) {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            "AssignedAccountNo": this.Select_account
                        }, {
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                } else {
                    this.csvdata1 = Csvdata.find({
                        $and: [{
                            Assigned_category_id: "not assigned"
                        }, {
                            "Txn_Posted_Date": {
                                $gte: new Date(this.lowerlimitstring),
                                $lt: new Date(this.upperlimitstring)
                            }
                        }]
                    }, {
                        sort: sort_order
                    }).zone();
                }
            }
        }
        var self = this;
        self.csvdata = null;
        this.csvdata1.subscribe((data) => {
            this.ngZone.run(() => {
                self.csvdata = data;
                self.loading = false;
            });
        });
        setTimeout(function() {
            self.loading = false;
        }, 3000);
    }
    hide_more_button(trigger){
         if(trigger==true){
             this.hideit=true;
         }
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.productSub.unsubscribe();
        this.subcategorySub.unsubscribe();
        this.headarraySub.unsubscribe();
        this.parameterSub.unsubscribe();
        this.accountSub.unsubscribe();
    }
}