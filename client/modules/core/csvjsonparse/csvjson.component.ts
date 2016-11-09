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
    Csvdata,
    Productcategory,
    Subcategory
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
    csvdata: Observable<any[]>; // this is for csv data collection
    csvSub: Subscription;

    parentcategoryarray: any;
    productcategory: Observable<any[]>;
    productSub: Subscription;

    subcategoryarray: any;
    subcategory: Observable<any[]>;
    subcategorySub: Subscription;
    
    successmessage: string;
    messageshow: boolean = true;

    constructor() {}

    ngOnInit() {

        //  *** subscribing to csvdata which is unprocessed right now ***
        this.csvdata = Csvdata.find({}).zone();
        this.csvSub = MeteorObservable.subscribe('csvdata_unprocessed').subscribe();

        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray=data;
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray=data;
        });
    }

    handleFiles() {
        // Check for the various File API support.
        var files = document.getElementById('files').files;
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results, file) {
                Meteor.call('parseUpload', results.data, (error, response) => {
                    if (error) {
                        this.messageshow = true;
                        this.successmessage = "Document not uploaded ";
                    } else {
                        console.log(response);
                        console.log("in response message is" + response);
                        this.messageshow = true;
                        this.successmessage = "Document Uploaded Sucessfully";
                    }
                });
            }
        });
    }
    ngOnDestroy() {
    this.csvSub.unsubscribe();
    this.productSub.unsubscribe();
    this.subcategorySub.unsubscribe();
  }
}