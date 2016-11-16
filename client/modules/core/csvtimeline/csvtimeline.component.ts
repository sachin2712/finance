import {
    Component,
    OnInit,
    OnChanges,
    Input,
    OnDestroy,
    NgZone
} from '@angular/core';
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
    Csvdata,
    Productcategory,
    Subcategory,
    Head
} from '../../../../both/collections/csvdata.collection';
import template from './csvtimeline.html';


@Component({
    selector: 'csvtimeline',
    template
})

export class CsvTimelineComponent implements OnInit, OnChanges, OnDestroy {
    loading: boolean= false;
    csvdata1: Observable<any[]>;
    csvdata: any;
    csvSub: Subscription;
    
    parentcategoryarray: any;
    productcategory: Observable<any[]>;
    productSub: Subscription;

    subcategoryarray: any;
    subcategory: Observable<any[]>;
    subcategorySub: Subscription;

    headarraylist: any;
    headarrayobservable: Observable<any[]>;
    headarraySub: Subscription;

    headvalue: any;
    headobservable: Observable<any[]>;
    headSub: Subscription;

    loginuser: any;
    loginrole: boolean; // *** will use for hide assigning label****

    data_month: any;
    sort_order: any;
    month_in_headbar: any;
    yearly: any;
    monthly: any;
    dateB: any;
    dbdate: any;
    initialupperlimit: any;

    constructor(private ngZone: NgZone) {}
    ngOnChanges() {
        this.loginuser = Meteor.user();
        this.data_month = moment();
    }
    
    ngOnInit() {
        this.loading=true;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        //  *** all date related code ****
        this.data_month = moment();
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        this.yearly = this.data_month.format('YYYY');
        this.monthly = this.data_month.format('MM');
        this.dateB = moment().year(this.yearly).month(this.monthly - 1).date(1);
        this.dbdate = this.dateB.format('MM-DD-YYYY');
        this.initialupperlimit = this.data_month.format('MM-DD-YYYY');
        //  *** getting data from db related to this month***
        setTimeout(this.loading=false, 10000);
        this.csvdata1 = Csvdata.find({
            "Txn_Posted_Date": {
                $gt: new Date(this.dbdate),
                $lte: new Date(this.initialupperlimit)
            }
        }, {
            sort: sort_order
        }).zone();
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.csvdata1.subscribe((data)=>{
            this.ngZone.run(() => {
                this.csvdata=data;
                this.loading=false;
            });
        },
        (error)=>{
            console.log(error);
        },
        ()=>{
            console.log("this.csvdata1 is not getting anything. Finished");
        });
        this.data_month = this.dateB;

        // *** we are passing parent category and child category object as input to csvtimeline component child transaction ***
        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray=data;
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray=data;
        });

        this.headarrayobservable = Head.find({}).zone();
        this.headarraySub = MeteorObservable.subscribe('headlist').subscribe();
        this.headarrayobservable.subscribe((data) => {
            this.headarraylist=data;
        });


    }

    //  ******** incremented monthly data *****
    csvDataMonthlyPlus() {
        this.loading=true;
        var sort_order = {};
        var product_order = {};
        product_order["category"] = 1;
        //  *** all date related code ****      
        sort_order["Txn_Posted_Date"] = -1;
        //  *** momentjs use ** 
        var incrementDateMoment = moment(this.data_month);
        incrementDateMoment.add(1, 'months');
        this.data_month = moment(incrementDateMoment);
        var data_month_temp = incrementDateMoment;
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        //  ***** here we need two months next and next to next ****
        var yearly = this.data_month.format('YYYY');
        var monthly = this.data_month.format('MM');
        var dateB = moment().year(yearly).month(monthly).date(1);
        var dbdatelower = this.data_month.format('MM-DD-YYYY');
        var dbdateupperlimit = dateB.format('MM-DD-YYYY');
        //  *** getting data from db related to this month***
        setTimeout(this.loading=false, 10000);
        var self=this;
        this.csvdata1 = Csvdata.find({
            "Txn_Posted_Date": {
                $gte: new Date(dbdatelower),
                $lt: new Date(dbdateupperlimit)
            }
        }, {
            sort: sort_order
        }).zone();
        this.csvdata1.subscribe((data)=>{
            this.ngZone.run(() => {
                self.csvdata=data;
                self.loading=false;
            });
        });
    }

    csvDataMonthlyMinus() {
        this.loading=true;
        var sort_order = {};
        var product_order = {};
        product_order["category"] = 1;
        //  *** all date related code ****   
        sort_order["Txn_Posted_Date"] = -1;
        var dbdateprevious = this.data_month.format('MM-DD-YYYY');
        var decrementDateMoment = moment(this.data_month);
        decrementDateMoment.subtract(1, 'months');

        this.data_month = decrementDateMoment;
        this.month_in_headbar = this.data_month.format('MMMM YYYY');
        //  ***** code to data retrive *****
        var yearly = this.data_month.format('YYYY');
        var monthly = this.data_month.format('MM');
        var dateB = moment().year(yearly).month(monthly - 1).date(1);
        var dbdate = dateB.format('MM-DD-YYYY');

        //  *** getting data from db related to this month***
        setTimeout(this.loading=false, 10000);
        this.csvdata1 = Csvdata.find({
            "Txn_Posted_Date": {
                $gte: new Date(dbdate),
                $lt: new Date(dbdateprevious)
            }
        }, {
            sort: sort_order
        }).zone();
        var self=this;
        this.csvdata1.subscribe((data)=>{
          this.ngZone.run(() => {
                self.csvdata=data;
                self.loading=false;
            });
        });

    }
    ngOnDestroy() {
    this.csvSub.unsubscribe();
    this.productSub.unsubscribe();
    this.subcategorySub.unsubscribe();
    this.headarraySub.unsubscribe();
  }
}