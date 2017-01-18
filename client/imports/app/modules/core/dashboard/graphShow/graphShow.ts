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
} from '../../../../../../../both/collections/csvdata.collection';

@Component({
    selector: 'graphshow',
    template
})
@InjectUser('user')
export class GraphShowComponent implements OnInit, OnDestroy {
 @Input() InputGraph: any;
 //*** head list is use for storing getting head name from _id because our graphdata store _id not Head name. ***
 @Input() Head_List: any;
 @Input() graphType: any;
 //*** timing related info 
  date: any;
  current_year_header: any;
  current_year: number;
  current_month: any;
 

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
      this.barChartType = this.graphType;
        this.barChartData = [{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Expense'
        }, {
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            label: 'Income'
        }];

        this.date = moment();
        this.current_month = parseInt(this.date.format('MM'));
        this.current_year_header = this.date.format('YYYY');
        if(this.current_month > 3){
            this.current_year = parseInt(this.current_year_header);
        }
        else
        {
            this.current_year = parseInt(this.current_year_header) - 1;
        }
        this.graphviewcreate();
 }

 graphviewcreate(){
     if(this.InputGraph){
            this.labelfordata=[];
            this.labellist=this.InputGraph.graph_head_list;
            this.labellistcount=this.labellist.length;
            for(let i=0;i<this.InputGraph.graph_head_list.length;i++){
                this.filtervalue = _.filter(this.Head_List, {
                    "_id": this.InputGraph.graph_head_list[i]
                });
                if(this.filtervalue){
                     this.labelfordata.push(this.filtervalue[0].head);  
                }
             
            }
        }

       var  datayear = this.InputGraph.graph_statistic ? this.InputGraph.graph_statistic['FY'+this.current_year]:false;
       if(datayear){
                    //** label will store month names here 
              var label = [];
              var datawithhead = {};
            _.forEach(this.labellist, function(value){
                    datawithhead[value]=[];
                    datawithhead['total'+value]=0;
              });
                  for(var i=0;i<12;i++){
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
         var newdata=[];
       _.forEach(this.InputGraph.graph_head_list, function(value){
                  var input={
                      data: datawithhead[value],
                      label: accounting.formatNumber(datawithhead['total'+value], " ") 
                  };
                   newdata.push(input);
              });
       for(let i=0;i<this.labelfordata.length;i++){
           newdata[i].label=this.labelfordata[i]+' '+newdata[i].label;
       }
        this.barChartData=newdata;
    }
 }
    yearMinus() {
        if(this.current_month > 3){
            this.date.subtract(1, 'year');
            this.current_year = parseInt(this.date.format('YYYY'));
            this.graphviewcreate();
        }
        else{
            this.current_year = this.current_year - 1;
            this.graphviewcreate();
        }     
    }

    yearPlus() {
        if(this.current_month > 3){
              this.date.add(1, 'year');
              this.current_year = parseInt(this.date.format('YYYY'));
              this.graphviewcreate();
        }
        else{
            this.current_year = this.current_year + 1;
            this.graphviewcreate();
        } 
    }
    ngOnDestroy() {}
}