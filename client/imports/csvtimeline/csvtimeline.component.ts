import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Csvdata }   from '../../../both/collections/csvdata.collection';

import template from './csvtimeline.html';
 

@Component({
  selector: 'csvtimeline',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class CsvTimelineComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;
  
  ngOnInit() {
       var sort_order={};
       sort_order["Txn_Posted_Date"]=-1;
    this.csvdata = Csvdata.find({},{sort:sort_order});
  }

  
}

