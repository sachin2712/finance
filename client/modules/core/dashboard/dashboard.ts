import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
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

import template from './dashboardtemplate.html';
import {
    Graphdata,
    Csvdata,
    Head
} from '../../../../both/collections/csvdata.collection';

@Component({
    selector: 'dashboard',
    template
})
@InjectUser('user')
export class DashboardComponent implements OnInit, OnDestroy {
    complete_csvdata: Observable < any[] > ; // this is for csv data collection
    complete_csvSub: Subscription;
    all_csvdata: any;
    yearlyData: any;

    Income: any;
    Expense: any;
    headSub: Subscription;

    current_year_header: any;
    current_year: number;

    date: any;
    graphData: Observable <any[]>;
    graphDataSub: Subscription;
    chartData: any = [];
    user: Meteor.User;
    processingStart: boolean = false;
    processingYearStart: boolean = false;
    label: string[];
    constructor(private ngZone: NgZone, private _router: Router) {}

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;



    ngOnInit() {

        this.charData = [{
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Expense'
          }, {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Income'
          }];


        this.Income=Head.findOne({"head":"Income"});
        this.Expense=Head.findOne({"head":"Expense"});
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();

        this.processingYearStart = true;
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);

        this.graphData = Graphdata.find().zone();
        this.graphDataSub = MeteorObservable.subscribe('csvdata_month').subscribe((data) => {});
        this.graphData.subscribe((data)=>{
          if(data){
            console.log(data);
             // var self = this;
             this.yearlyData=data[0];
              if(this.yearlyData){
             var datayear=this.yearlyData[this.current_year];
                  console.log(datayear);
                  var label=[];
                  var CR=[];
                  var DR=[];
                  _.forEach(datayear, function(value, key) {
                     if(key.indexOf("_Income")!=-1){
                          label.push(key.substring(0,key.indexOf("_Income")));
                          CR.push(value);
                        }
                      else{
                           DR.push(value);
                        }
                      });

                  this.barChartLabels=label;
                  this.charData=[{ data: DR, label: 'Expense'}, { data: CR,label: 'Income'}];
                   this.ngZone.run(() => {
                this.processingYearStart = false;
                      });
                   }
                 }
                 else{
                   console.log("processing");
                 }
        });

        this.complete_csvdata = Csvdata.find({}).zone();
        this.complete_csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.complete_csvdata.subscribe((data) => {
          
            this.all_csvdata = data;
        });

        if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline']);
        }
    }
    // ***** this function we will call on every year change *****
    year_data_sub(newdate: number) {
                  // var self = this;
                  var datayear=this.yearlyData[newdate];
                  var label=[];
                  var CR=[];
                  var DR=[];
                  _.forEach(datayear, function(value, key) {
                        if(key.indexOf("_Income")!=-1){
                          label.push(key.substring(0,key.indexOf("_Income")));
                          CR.push(value);
                        }
                        else{
                           DR.push(value);
                        }
                      });

                  this.barChartLabels=label;
                  this.charData=[{ data: DR, label: 'Expense'},{ data: CR,label: 'Income'}];
    }

    yearMinus() {
        this.date.subtract(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    yearPlus() {
        this.date.add(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    generate_graph_data() {
        var self = this;
        self.processingStart = true;
        Meteor.call('refresh_graph_data', self.all_csvdata, this.Income._id, this.Expense._id, (error, response) => {
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
    ngOnDestroy() {
        this.graphDataSub.unsubscribe();
        this.complete_csvSub.unsubscribe();
    }
}