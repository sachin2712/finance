import {
    Component,
    OnInit,
    Input,
    OnDestroy
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
import template from './assignCategory.html';


@Component({
    selector: '[assign]',
    template
})

export class AssignCategoryComponent implements OnInit, OnDestroy {
    productcategory: Observable<any[]>; // this is for our productcategory collection
    @Input() id: string;
    addForm: FormGroup; // form group instance
    productSub: Subscription;

    constructor(private _formBuilder: FormBuilder) {}
    ngOnInit() {
        this.addForm = this._formBuilder.group({
            category: ['', Validators.required],
        });
        
        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();

    }
    addCategory(id, category) {
        // **** add category is actually assigning category to all the transaction notes ****
        Meteor.call('addCategory', id, category, (error, response) => {
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

    ngOnDestroy() {
    this.productSub.unsubscribe();
  }

}