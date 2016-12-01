import {
    Component,
    OnInit,
    Input,
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
import {
    Csvdata,
    Productcategory,
    Subcategory,
    Head
} from '../../../../both/collections/csvdata.collection';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MeteorObservable
} from 'meteor-rxjs';
import template from './csvjsoncomponent.html';


@Component({
    selector: 'csvjson',
    template
})

export class CsvJsonComponent implements OnInit, OnDestroy {
    Income: any;
    Expense: any;
    headSub: Subscription;

    successmessage: string = "checking";
    uploadprocess: boolean = false;
    messageshow: boolean = false;

    constructor(private ngZone: NgZone, private _router: Router) {}

    ngOnInit() {
        //**** time limit check condition
        if (localStorage.getItem("login_time")) {
            var login_time = new Date(localStorage.getItem("login_time"));
            var current_time = new Date();
            var diff = (current_time.getTime() - login_time.getTime()) / 1000;
            if (diff > 3600) {
                console.log("Your session has expired. Please log in again");
                var self = this;
                localStorage.removeItem('login_time');
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
        }

        this.Income = Head.findOne({
            "head": "Income"
        });
        this.Expense = Head.findOne({
            "head": "Expense"
        });
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        console.log(this.Income);
        console.log(this.Expense);
    }


    handleFiles() {
        // Check for the various File API support.
        var self = this;
        self.uploadprocess = true;
        self.messageshow = false;
        var files = document.getElementById('files').files;
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results, file) {
                Meteor.call('parseUpload', results.data, self.Income._id, self.Expense._id, (error, response) => {
                    if (error) {
                        console.log(error);
                        // this.uploadfail();
                        self.ngZone.run(() => {
                            self.messageshow = true;
                            self.successmessage = "Document not uploaded ";
                            self.uploadprocess = false;
                        });
                    } else {
                        self.ngZone.run(() => {
                            self.messageshow = true;
                            self.uploadprocess = false;
                            self.successmessage = "Document Uploaded Sucessfully";
                        });
                    }
                });
            }
        });
    }
    ngOnDestroy() {
        this.headSub.unsubscribe();
    }
}