import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
import { 
    NgForm 
} from '@angular/forms';
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
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
import {
    InjectUser
} from 'angular2-meteor-accounts-ui';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './dashboardtemplate.html';
import {
    Graphdata,
    Csvdata,
    Head,
    Graphlist,
    Productcategory,
    Subcategory,
    CategoryGraphList
} from '../../../../../../both/collections/csvdata.collection';

@Component({
    selector: 'dashboard',
    template
})
@InjectUser('user')
export class DashboardComponent implements OnInit, OnDestroy {
    //** this is for csv data collection
    complete_csvdata: Observable < any[] > ; 
    complete_csvSub: Subscription;
    all_csvdata: any;

    //** these parent is used to store parent category and subcategory data.**
    parentcategoryarray: any;
    productcategory: Observable < any[] > ;
    productSub: Subscription;
    subcategoryarray: any;
    subcategory: Observable < any[] > ;
    subcategorySub: Subscription;


    //*** adding graph related variables ***
    firstStep: boolean= true;
    secondStep: boolean= false;
    thirdStep: boolean= false;
    lastStep: boolean= false;
    secondStepCategory: boolean= false;
    lastStepCategory: boolean= false;
    showSucessMessageForNewGraph: boolean= false;
    graphdeletedmessage: boolean= false;
    headAdd: Array<any>=[];//** array used for creating new graph of head
    categoryAdd: Array<any>=[];//** array used for creating new graph of category

    newGraph: Observable <any[]>;
    newGraphSub: Subscription;
    newGraphdata: any;// use for sending data to genrate function

    newCategory: Observable <any[]>;
    newCategoryGraphSub: Subscription;
    newCategorydata: any;

    graphsize: boolean=false;
    selectedheadgraph: any;
    selectedcategorygraph: any;

    income: any;
    expense: any;
    Selected: any;

    headCompleteList: Observable < any[] >;
    head_list: any;
    headSub: Subscription;

    current_year_header: any;
    date: any;

    chartData: any = [];
    user: Meteor.User;
    processingStart: boolean = false;
    processingYearStart: boolean = false;

    barGraph: string = "bar";
    lineGraph: string = "line";
   
    constructor(private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');

        if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline/',this.date.format('MM'),this.current_year_header]);
        }
        this.processingStart = true;
     if(localStorage.getItem("login_time")){
        var login_time=new Date(localStorage.getItem("login_time"));
        var current_time=new Date();
        var diff=(current_time.getTime() - login_time.getTime())/1000;
        if(diff > 3600){
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
        
        // this.processingYearStart = true;

        this.headCompleteList = Head.find({}).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.headCompleteList.subscribe((data)=>{
            this.head_list=data;
        });

        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray = data;
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray = data;
        });
        
        this.newGraph = Graphlist.find({}).zone();
        this.newGraphSub = MeteorObservable.subscribe('graphlist').subscribe();
        this.newGraph.subscribe((data)=> {
            this.newGraphdata=data;
            this.graphsize = this.newGraphdata.length != 0 ? true: false;
            this.processingStart = false;
        });

        this.newCategory = CategoryGraphList.find({}).zone();
        this.newCategoryGraphSub = MeteorObservable.subscribe('categorygraphlist').subscribe();
        this.newCategory.subscribe((data)=> {
            this.newCategorydata=data;
            console.log(this.newCategorydata);
             this.processingStart = false;
        });

        // ** code to extract all csv data from data base according to order which we set in sort_order
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = 1;
        this.complete_csvdata = Csvdata.find({},{sort: sort_order}).zone();
        this.complete_csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.complete_csvdata.subscribe((data) => {
            this.all_csvdata = data;
        });
    }

    generate_graph_data() { 
            this.generate_head_list_data();
            this.generate_category_list_data();
    }
    generate_head_list_data(){
        var self = this;
        self.processingStart = true;
         Meteor.call('refresh_graph_list', self.all_csvdata, self.newGraphdata, (error, response) => {
                if (error) {
                    console.log(error.reason);
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                } else {
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                    console.log(response);
                }
            });
    }
    generate_category_list_data(){
        var self = this;
        self.processingStart = true;
        Meteor.call('refresh_category_graph_list', self.all_csvdata, self.newCategorydata, self.subcategoryarray, (error, response) => {
                if (error) {
                    console.log(error.reason);
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                } else {
                    self.ngZone.run(() => {
                        self.processingStart = false;
                    });
                    console.log(response);
                }
            });
    }
    // *** category graph code 
    CategorySelected(){
      console.log("category selected");
       this.firstStep=false;
       this.secondStepCategory=true;
    }
    processSecondStepCategory(){
        this.secondStepCategory=false;
        this.lastStepCategory=true;
    }
     //*** used for adding category in array of new graph of category.
    pushpopcategory(value){
         if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
            this.categoryAdd.push(value);
        }
        else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
            let indexx = this.categoryAdd.indexOf(value);
            this.categoryAdd.splice(indexx,1);
        }
    }

    insertCategoryGraph(form: NgForm){
            if(form.value.graphname !== '')
        {
        CategoryGraphList.insert({
                "graph_name": form.value.graphname,
                "graph_head_list": this.categoryAdd
            }).zone();
        this.showSucessMessageForNewGraph=true;
        setTimeout(()=> { this.showSucessMessageForNewGraph=false;}, 3000);
        }
        this.categoryAdd=[];
        this.lastStepCategory=false;
        this.firstStep=true;
        this.generate_category_list_data();
    }
    // ***  code for graph delete
    SelectedHead(graph){
            this.selectedheadgraph=graph;
        }
    Selectedcategory(graph){
            this.selectedcategorygraph=graph;
        }
    DeleteSelected(){
       if(this.selectedheadgraph){
           Graphlist.remove({_id: this.selectedheadgraph._id}).zone();
           this.selectedheadgraph='';
           this.graphdeletedmessage=true;
           setTimeout(()=> { this.graphdeletedmessage=false;}, 3000);
       }
    }
     DeleteSelectedCategoryGraph(){
       if(this.selectedcategorygraph){
           CategoryGraphList.remove({_id: this.selectedcategorygraph._id}).zone();
           this.selectedcategorygraph='';
           this.graphdeletedmessage=true;
           setTimeout(()=> { this.graphdeletedmessage=false;}, 3000);
       }
    }
    // *** new graph adding functions and code ***
    HeadSelected(){
        console.log("headSelected called");
        this.firstStep=false;
        this.secondStep=true;
    }
    //*** used for adding head in array of new graph of head.
    pushpophead(value){
        if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
            this.headAdd.push(value);
        }
        else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
            let indexx = this.headAdd.indexOf(value);
            this.headAdd.splice(indexx,1);
        }
    }
   
    processSecondStep(){
       this.secondStep=false;
       this.lastStep=true;
    }
    insertNewGraph(form: NgForm){
        if(form.value.graphname !== '')
        {
        Graphlist.insert({
                "graph_name": form.value.graphname,
                "graph_head_list": this.headAdd
            }).zone();
        this.showSucessMessageForNewGraph=true;
        setTimeout(()=> { this.showSucessMessageForNewGraph=false;}, 3000);
        }
        this.headAdd=[];
        this.lastStep=false;
        this.firstStep=true;
        // this.generate_graph_data();
        this.generate_head_list_data();
    }
    clearNewGraphEntry(){
        this.headAdd=[];
        this.secondStep=false;
        this.lastStep=false;
        this.lastStepCategory=false;
        this.secondStepCategory=false;
        this.firstStep=true;
    }
    ngOnDestroy() {
        // this.graphDataSub.unsubscribe();
        this.complete_csvSub.unsubscribe();
        this.newGraphSub.unsubscribe();
        this.newCategoryGraphSub.unsubscribe();
    }
}