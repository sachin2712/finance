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
    Csvdata
} from '../../../../both/collections/csvdata.collection';
import {
    MeteorComponent
} from 'angular2-meteor';
import {
    RowInfoComponent
} from './rowInfoComponent/rowInfo.component';
import template from './csvjsoncomponent.html';


@Component({
    selector: 'csvjson',
    template,
    directives: [RowInfoComponent]
})

export class CsvJsonComponent extends MeteorComponent implements OnInit {
    csvdata: Mongo.Cursor < any > ; // this is for csv data collection
    productcategory: Mongo.Cursor < any > ; // this is for our productcategory collection
    successmessage: string;
    messageshow: boolean = true;


    constructor(private _router: Router) {
        super();
    }

    ngOnInit() {
        //    **** for checking user is login or not ****  
        if (!Meteor.userId()) {
            this._router.navigate(['/login']);
        }
        // this is for showing only those transactions whose category is not assigned 
        this.csvdata = Csvdata.find({
            "is_processed": 0
        });

        this.subscribe('csvdata', () => {
            this.csvdata = Csvdata.find({
                "is_processed": 0
            });
        }, true);

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
}