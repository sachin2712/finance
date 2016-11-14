import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    FormGroup,
    FormBuilder,
    Validators
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
    Csvdata,
    Productcategory
} from '../../../../../../both/collections/csvdata.collection';
import * as _ from 'lodash';
import template from './assignCategory.html';


@Component({
    selector: '[assign]',
    template
})

export class AssignCategoryComponent implements OnInit {
    @Input() id: string;
    @Input() main_cat_list: any;
    @Input() child_category_list: any;
    child_list: any;
    addForm: FormGroup; // form group instance

    constructor(private _formBuilder: FormBuilder) {}
    ngOnInit() {
        this.addForm = this._formBuilder.group({
            category: ['', Validators.required],
        });

       // *** thing to note here . we don't have to subscribe in child component if we already subscribe in parent component.
       // for example we here we have not used subscription but if we try to access Productcategory collection by below code 
       // then it will work . 
       //  productcategory: Observable<any[]>;
       // this.productcategory = Productcategory.find({}).zone();
       // console.log(this.productcategory);
       // this.productcategory.subscribe((data) => {
       //      console.log(data);
       //  });
    }
     ParentSelected(selected_parent){
             this.child_list=_.filter(this.child_category_list,{"parent_id": selected_parent});        
       }

    addCategory(Transaction_id, category_id) {
        // **** add category is actually assigning category to all the transaction notes ****
        Meteor.call('addCategory', Transaction_id, category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
    addNewCategory() {
        
        if (this.addForm.valid) {
            Productcategory.insert(this.addForm.value);

            // to empty the input box
            this.addForm.reset();
        }
    }

}