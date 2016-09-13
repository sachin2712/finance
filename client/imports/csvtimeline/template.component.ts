import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';

import { Csvdata }   from '../../../both/collections/csvdata.collection';
import { CsvTimelineComponent } from './csvtimeline.component';

import template from './template.html';
 

@Component({
  selector: 'csvtemplate',
  template,
  styleUrls: ['templatecomponent.css'],
  directives: [CsvTimelineComponent, ROUTER_DIRECTIVES]
})

export class TemplateComponent implements OnInit {
  csvdata: Mongo.Cursor<any>;

  ngOnInit() {
    this.csvdata = Csvdata.find();
  }

  
}

