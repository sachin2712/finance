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
    Subcategory
} from '../../../../both/collections/csvdata.collection';

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
    headAdd: Array<any>=[];
    newGraph: Observable <any[]>;
    newGraphSub: Subscription;
    newGraphdata: any;// use for sending data to genrate function
    graphsize: boolean=false;
    selectedgraph: any;

    income: any;
    expense: any;
    Selected: any;

    headCompleteList: Observable < any[] >;
    head_list: any;
    headSub: Subscription;

    current_year_header: any;
    current_year: number;

    date: any;
    chartData: any = [];
    user: Meteor.User;
    processingStart: boolean = false;
    processingYearStart: boolean = false;
   
    constructor(private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
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
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);

     if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline/'+this.date.format('MM')+'/'+this.current_year_header]);
        }

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
            console.log(this.newGraphdata);
            this.graphsize = this.newGraphdata.length != 0 ? true: false;
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
    // ***** this function we will call on every year change *****

    yearMinus() {
        this.date.subtract(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        // this.year_data_sub(this.current_year); have to add option for sending year value in child component
    }

    yearPlus() {
        this.date.add(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        // this.year_data_sub(this.current_year);  have to add option for sending year value in child component
    }

    generate_graph_data() {
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
    insertCategoryGraph(form: NgForm){
            if(form.value.graphname !== '')
        {
        // Graphlist.insert({
        //         "graph_name": form.value.graphname,
        //         "graph_head_list": this.headAdd
        //     }).zone();
        // this.showSucessMessageForNewGraph=true;
        // setTimeout(()=> { this.showSucessMessageForNewGraph=false;}, 3000);
        }
        this.headAdd=[];
        this.lastStepCategory=false;
        this.firstStep=true;
        this.generate_graph_data();
    }
    // ***  code for graph delete
    SelectedG(graph){
            this.selectedgraph=graph;
        }
    DeleteSelected(){
       if(this.selectedgraph){
           Graphlist.remove({_id: this.selectedgraph._id}).zone();
           this.selectedgraph='';
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
        this.generate_graph_data();
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
    }
}