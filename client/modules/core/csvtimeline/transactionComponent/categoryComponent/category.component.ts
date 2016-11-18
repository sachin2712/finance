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
import template from './category.html';

@Component({
    selector: 'category',
    template
})

export class CategoryComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Input() assigned_category_id: string;
    @Input() is_processed: number;
    @Input() Cr_Dr: string;
    @Input() parent_category_list: any;
    @Input() child_category_list: any;
    show_category: any;
    parent_category: any;
    select_parent: boolean;
    child_list: any;
    Choose_Cateogry: string = "Choose Cateogry";
    constructor() {}
    ngOnInit() {
        if (this.assigned_category_id != "not assigned") {
            this.show_category = _.filter(this.parent_category_list, {
                "_id": this.assigned_category_id
            });
            if (this.show_category == '') {
                this.show_category = _.filter(this.child_category_list, {
                    "_id": this.assigned_category_id
                });
            }
            if (this.show_category[0].parent_id) {
                this.parent_category = _.filter(this.parent_category_list, {
                    "_id": this.show_category[0].parent_id
                });
            }
        }
        this.select_parent = true;
    }
    ParentSelected(selected_parent) {
        this.child_list = _.filter(this.child_category_list, {
            "parent_id": selected_parent._id
        });
        this.Choose_Cateogry = selected_parent.category;
        this.select_parent = false;
    }

    changeCategory(id, category_id) {
        Meteor.call('changeCategory', id, category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.select_parent = true;
        this.Choose_Cateogry = "Choose Cateogry";
    }
    ngOnDestroy() {}
}