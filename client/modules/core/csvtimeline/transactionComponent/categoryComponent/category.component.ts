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
import template from './category.html';

@Component({
    selector: 'category',
    template
})

export class CategoryComponent implements OnInit, OnDestroy {
    productcategory: Observable<any[]>; // this is for our productcategory collection
    @Input() id: string;
    @Input() assigned_category: string;
    @Input() is_processed: number;
    @Input() Cr_Dr: string;
    productSub: Subscription;
    constructor() {}
    ngOnInit() {     
        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
    }
    changeCategory(id, category) {
      Meteor.call('changeCategory', id, category, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    ngOnDestroy() {
    this.productSub.unsubscribe();
  }
}