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
    @Input() headlist: any;
    show_head: any;
    constructor() {}
    ngOnInit() {     
      console.log(this.assigned_head_id);
      console.log(this.headlist);
      if(this.assigned_head_id != '') {     
         this.show_head=_.filter(this.headlist,{"_id": this.assigned_head_id});
      }
      console.log(this.show_head);
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