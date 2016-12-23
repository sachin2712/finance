import {
    Component,
    OnInit,
    OnDestroy,
    Input,
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
import template from './graphShowtemplate.html';
import {
    Head
} from '../../../../../both/collections/csvdata.collection';

@Component({
    selector: 'graphshow',
    template
})
@InjectUser('user')
export class GraphShowComponent implements OnInit, OnDestroy {
 @Input() InputGraph: any;
 @Input() Head_List: any;//*** head list is use for storing getting head name from _id because our graphdata store _id not Head name. ***
 @Input() graphType: any;
 //*** timing related info 
  date: any;
  current_year_header: any;
  current_year: number;
 

 // *** this will store our label list ***
  graph_statistic: any;
  labellist: any;
  labelfordata: any=[];
  filtervalue: any;
  labelname: any;
  labellistcount: number; 
  fiscalMonths: string[] = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December','January', 'February', 'March'];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType:string = 'bar' ;
  public barChartLegend:boolean = true;
  public barChartData:any[];
  
  ngOnInit() { 
      console.log(this.graphType);
      this.barChartType = this.graphType;
        this.barChartData = [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Expense'
        }, {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Income'
        }];
        console.log(this.barChartData);

        // *** info related to move year list.
        // this.processingYearStart = true;
        this.date = moment();
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);

        console.log(this.InputGraph);
        if(this.InputGraph){
            this.labellist=this.InputGraph.graph_head_list;
            this.labellistcount=this.labellist.length;
            console.log(this.labellistcount);console.log(this.InputGraph.graph_head_list.length);
            for(let i=0;i<this.InputGraph.graph_head_list.length;i++){
                console.log("filtering for id "+ this.InputGraph.graph_head_list[i]);
                this.filtervalue = _.filter(this.Head_List, {
                    "_id": this.InputGraph.graph_head_list[i]
                });
                console.log(this.filtervalue);
                if(this.filtervalue){
                     this.labelfordata.push(this.filtervalue[0].head);  
                }
             
            }
            console.log("extracted values for label are ");
            console.log(this.labelfordata);
        }

        console.log(this.Head_List);//*** contain head name and _id

       var  datayear = this.InputGraph.graph_statistic ? this.InputGraph.graph_statistic['FY'+this.current_year]:false;
       if(datayear){
                    var label = [];//** label will store month names here 
                    var datawithhead = {};
            _.forEach(this.labellist, function(value){
                    datawithhead[value]=[];
                    datawithhead['total'+value]=0;
              });
                  for(var i=0;i<12;i++){
                       // this.fiscalMonths[i];
                      for(var j=0;j<this.labellistcount;j++){
                          if(datayear[this.labellist[j]] && datayear[this.labellist[j]][this.fiscalMonths[i]]){
                              datawithhead[this.labellist[j]].push(datayear[this.labellist[j]][this.fiscalMonths[i]]);
                              datawithhead['total'+this.labellist[j]] += datayear[this.labellist[j]][this.fiscalMonths[i]];
                          }
                          else{
                              datawithhead[this.labellist[j]].push(0);
                          }
                      }
                  }
    
// var expense_label="Total Expense : " + accounting.formatNumber(total_expense," ");
// var income_label="Total Income : " + accounting.formatNumber(total_income," ");
// console.log(expense_label);
// console.log(income_label);
// this.barChartLabels = label;
// this.charData = [{
//            data: DR,
//    label: expense_label
//      }, {
//           data: CR,
//           label: income_label
//  }]; 
// accounting.formatNumber(datawithhead['total'+value], " ")  

         var newdata=[];
       _.forEach(this.InputGraph.graph_head_list, function(value){
                  var input={
                      data: datawithhead[value],
                      label: accounting.formatNumber(datawithhead['total'+value], " ") 
                  };
                  console.log(input);
                    newdata.push(input);
              });
       for(let i=0;i<this.labelfordata.length;i++){
           newdata[i].label=this.labelfordata[i]+' '+newdata[i].label;
       }
        console.log(newdata);
        this.barChartData=newdata;
    }
 }
     // ***** this function we will call on every year change *****
    // year_data_sub(newdate: number) {
    //     // var self = this;
    // var  datayear = this.InputGraph.graph_statistic ? this.InputGraph.graph_statistic['FY'+this.newdate]:false;
    //    if(datayear){
    //                 var label = [];//** label will store month names here 
    //                 var datawithhead = {};
    //         _.forEach(this.labellist, function(value){
    //                 datawithhead[value]=[];
    //           });
    //               for(var i=0;i<12;i++){
    //                    // this.fiscalMonths[i];
    //                   for(var j=0;j<this.labellistcount;j++){
    //                       if(datayear[this.labellist[j]] && datayear[this.labellist[j]][this.fiscalMonths[i]]){
    //                           datawithhead[this.labellist[j]].push(datayear[this.labellist[j]][this.fiscalMonths[i]]);
    //                       }
    //                       else{
    //                           datawithhead[this.labellist[j]].push(0);
    //                       }
    //                   }
    //               }

    //      var newdata=[];
    //    _.forEach(this.InputGraph.graph_head_list, function(value){
    //               var input={
    //                   data: datawithhead[value],
    //                   label: value
    //               };
    //               console.log(input);
    //                 newdata.push(input);
    //           });
    //    for(let i=0;i<this.labelfordata.length;i++){
    //        newdata[i].label=this.labelfordata[i];
    //    }
    //     console.log(newdata);
    //     this.barChartData=newdata;
    // }
    // else{
    //     //     this.charData = [{
    //     //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     //     label: 'Not Found'
    //     // }, {
    //     //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     //     label: 'Not Found'
    //     // }];
    //    }             
    // }

    // yearMinus() {
    //     this.date.subtract(1, 'year');
    //     this.current_year_header = this.date.format('YYYY');
    //     this.current_year = parseInt(this.current_year_header);
    //     this.year_data_sub(this.current_year);
    // }

    // yearPlus() {
    //     this.date.add(1, 'year');
    //     this.current_year_header = this.date.format('YYYY');
    //     this.current_year = parseInt(this.current_year_header);
    //     this.year_data_sub(this.current_year);
    // }
  ngOnDestroy() {}
}