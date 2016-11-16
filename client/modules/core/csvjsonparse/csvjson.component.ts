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

    constructor(private ngZone: NgZone) {}

    ngOnInit() {
           
        this.Income=Head.findOne({"head":"Income"});
        this.Expense=Head.findOne({"head":"Expense"});
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