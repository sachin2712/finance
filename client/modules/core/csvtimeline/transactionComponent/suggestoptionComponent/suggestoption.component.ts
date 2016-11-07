import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    AfterContentInit
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
import template from './suggestoption.html';


@Component({
    selector: 'suggest-option',
    template
})

export class suggestionComponent implements OnInit, OnDestroy, AfterContentInit {
    categoryobservable: Observable < any[] > ; // this is for our productcategory collection
    categorySub: Subscription;
    suggestarray: any = [];
    allcategoryArray: any;
    category: any;
    n: any;
    description: string;
    @Input() input: string; // this variable will have input from parent  component
    @Input() id: string;
    ngOnInit() {
        this.description = this.input;
        this.categoryobservable = Productcategory.find({}).zone();
        this.categorySub = MeteorObservable.subscribe('Productcategory').subscribe((data) => {

            for (let i = 0; i < this.allcategoryArray.length; i++) {
                this.n = this.description.indexOf(this.allcategoryArray[i].category);
                if (this.n != -1) {
                    this.category = this.allcategoryArray[i].category;
                    this.suggestarray.push(this.category);
                }
            }
            console.log(this.suggestarray);

            console.log("done");
        });
        this.categoryobservable.subscribe(
            (data) => {
                this.allcategoryArray = data;
            },
            err => {},
            () => {}

        );
    }
    ngAfterContentInit() {}
    assigncategory(category: string) {
        Meteor.call('addCategory', this.id, category, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }

    ngOnDestroy() {
        this.categorySub.unsubscribe();
    }

}