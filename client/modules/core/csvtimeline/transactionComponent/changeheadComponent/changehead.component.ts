import {
    Component,
    OnInit,
    Input,
    OnDestroy
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
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
    Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import template from './changehead.html';

@Component({
    selector: 'changehead',
    template
})

export class ChangeHeadComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() assigned_head_id: string;
    @Input() headlist: any[];
    show_head: any;
    headlist_copy: any;
    constructor() {}
    ngOnInit() {   
       console.log("3");  
      console.log(this.assigned_head_id);
      console.log(this.headlist);
          this.headlist_copy=this.headlist;
      if(this.assigned_head_id != '') {     
         this.show_head=_.filter(this.headlist_copy,{"_id": this.assigned_head_id});
      }
      console.log(this.show_head);
      console.log("4");
    }
    changeHead(newhead_id) {
      console.log(newhead_id);
      Meteor.call('changeheadtag', this.id, newhead_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    ngOnDestroy() {
  }
}