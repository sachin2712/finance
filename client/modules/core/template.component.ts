import {
    Component,
    OnInit,
    OnChanges
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
    MeteorComponent
} from 'angular2-meteor';

import template from './template.html';


@Component({
    selector: 'csvtemplate',
    template
})

export class TemplateComponent extends MeteorComponent implements OnInit, OnChanges {
    checkloginuser: any;// store mongo curser
    logoutprocess: boolean;

    constructor(private _router: Router) {
        super();
        this.checkloginuser = Meteor.user();
    }

    ngOnChanges() {
        this.checkloginuser = Meteor.user();
    }

    ngOnInit() {
        this.logoutprocess = false;
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }
        this.checkloginuser = Meteor.user();
    }
    logout() {
        var self = this;
        self.logoutprocess = true;
        Meteor.logout(function(error) {
            if (error) {
                console.log("ERROR: " + error.reason);
            } else {
                self._router.navigate(['/login']);
            }
        });
    }
}