import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    NgZone
} from '@angular/core';
import { 
    NgForm 
} from '@angular/forms';
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
    Head,
    Accounts_no
} from '../../../../../../both/collections/csvdata.collection';
import {
    Observable
} from 'rxjs/Observable';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MeteorObservable
} from 'meteor-rxjs';
import * as _ from 'lodash';
// import { 
//     Papa 
// }from 'meteor/harrison:papa-parse';
import template from './csvjsoncomponent.html';


@Component({
    selector: 'csvjson',
    template
})

export class CsvJsonComponent implements OnInit, OnDestroy {
    Income: Observable <any[]> ;
    Incomevalue: any;
    Expense: Observable <any[]> ;
    Expensevalue: any;
    headSub: Subscription;

    accountlistvalue: any;
    accountlist: Observable < any[] > ;
    accountSub: Subscription;
    accountselected: string;
    DateFormatselected: string;

    uploadresult: any;
    addedstring: any;
    uploadstring: any;
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
                localStorage.removeItem('Meteor.loginToken');
                localStorage.removeItem('Meteor.loginTokenExpires');
                localStorage.removeItem('Meteor.userId');
                Meteor.logout(function(error) {
                    if (error) {
                        console.log("ERROR: " + error.reason);
                    } else {
                        self._router.navigate(['/login']);
                    }
                });
            }
            else{
              localStorage.setItem("login_time", current_time.toString());
            }
        }
        
        this.accountlist = Accounts_no.find({}).zone();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.accountlist.subscribe((data)=>{
            this.ngZone.run(() => {
            this.accountlistvalue=data;
          });
        });
        
        this.Income = Head.find({"head": "Income"}).zone();
        this.Expense = Head.find({"head": "Expense"}).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.Income.subscribe((data)=>{
            this.ngZone.run(() => {
            this.Incomevalue=data;
            });
        });
        this.Expense.subscribe((data)=>{
            this.ngZone.run(() => {
            this.Expensevalue=data;
           });
        });
    }


    handleFiles(form: NgForm) {
        // Check for the various File API support.
        this.accountselected=form.value.account;
        this.DateFormatselected=form.value.DateFormat;
        console.log("Selected Account Number "+this.accountselected);
        console.log("Selected Date format" + this.DateFormatselected);
        var self = this;
        self.uploadprocess = true;
        self.messageshow = false;
        var files = document.getElementById('files').files;
        console.log(files);
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results, file) {
                Meteor.call('parseUpload', results.data, self.Incomevalue[0]._id, self.Expensevalue[0]._id, self.accountselected,self.DateFormatselected, (error, response) => {
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
                            console.log(response);
                            self.uploadresult=response;
                            self.processdata(response);
                            console.log(self.uploadresult);
                            self.messageshow = true;
                            self.uploadprocess = false;
                            self.successmessage = "Document Uploaded Sucessfully";
                        });
                    }
                });
            }
        });
    }

    processdata(response){
           this.uploadresult["addedstring"]=new Array();
           this.uploadresult["updatedstring"]=new Array(); 
           var dummyfeed=new Array();     
       _.forEach(this.uploadresult.added, function(value, key) {
             var data={
                 "key":key,
                 "value":value
             };
             console.log(data);
             dummyfeed.push(data);
             });
            this.uploadresult["addedstring"]=dummyfeed;
            dummyfeed=[];

       _.forEach(this.uploadresult.updated, function(value, key) {
                var data={
                 "key":key,
                 "value":value
                };
                console.log(data);
                dummyfeed.push(data);
             });
            this.uploadresult["updatedstring"]=dummyfeed;
    }
    ngOnDestroy() {
        this.headSub.unsubscribe();
        this.accountSub.unsubscribe();
    }
}