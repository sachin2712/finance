// this component is used to add new head item in our head list

import {
    Component,
    OnInit,
    OnDestroy,
    NgZone
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
// *** new pattern***
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
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    Head
} from '../../../../../../both/collections/csvdata.collection';
import template from './head.html';
import {StorageService} from './../../services/storage';
import {RemoveStorageService} from './../../services/removeStorage';

@Component({
    selector: 'heads',
    template
})

export class HeadComponent implements OnInit, OnDestroy {
    headlist: Observable<any[]>;
    selectedCategory: any;
    headSub: Subscription;
    addForm: FormGroup;
    changevalue: string;
    headlistvalue: any;
    constructor(public _remove: RemoveStorageService, public _local: StorageService, private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) {}

    onSelect(category: any): void {
        this.selectedCategory = category;
    }

    ngOnInit() {
        //**** time limit check condition
        if (this._local.getLocaldata("login_time")) {
            var login_time = new Date(this._local.getLocaldata("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                this._remove.removeData();
                Meteor.logout(function (error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            } else {
                this._local.setLocalData("login_time", current_time.toString());
            }
        }

        this.headlist = Head.find({}).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.headlist.subscribe((data) => {
            this.ngZone.run(() => {
                this.headlistvalue = data;
            });
        });

        this.addForm = this.formBuilder.group({
            head: ['', Validators.required],
        });
    }

    addCategory() {
        if (this.addForm.valid) {
            Head.insert(this.addForm.value).zone();
            this.addForm.reset();
        }
    }

    updateCategory() {
        this.changevalue = this.addForm.controls['head'].value;

        if (this.changevalue != null) {
            Head.update({
                _id: this.selectedCategory._id
            }, {
                    $set: {
                        "head": this.changevalue
                    }
                }).zone();
            this.addForm.reset();
            this.selectedCategory = undefined;
        } else {
            this.addForm.reset();
            this.selectedCategory = undefined;

        }
    }

    removeCategory(category_id) {
        Meteor.call('head_remove', category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.addForm.reset();
        this.selectedCategory = "";
    }

    ngOnDestroy() {
        this.headSub.unsubscribe();
    }

}
