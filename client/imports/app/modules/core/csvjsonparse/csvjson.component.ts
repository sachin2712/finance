// This component is used upload new csv file into our database 

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
    Income: Observable < any[] > ;
    Incomevalue: any;
    Expense: Observable < any[] > ;
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

    repeateidarray: any[] = [];
    filecontainduplicate: boolean = false;
    duplicatearraylist: any[];
    originalarraylist: any[];
    foundelement: any;

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
            } else {
                localStorage.setItem("login_time", current_time.toString());
            }
        }

        this.accountlist = Accounts_no.find({}).zone();
        this.accountSub = MeteorObservable.subscribe('Accounts_no').subscribe();
        this.accountlist.subscribe((data) => {
            this.ngZone.run(() => {
                this.accountlistvalue = data;
            });
        });

        this.Income = Head.find({
            "head": "Income"
        }).zone();
        this.Expense = Head.find({
            "head": "Expense"
        }).zone();
        this.headSub = MeteorObservable.subscribe('headlist').subscribe();
        this.Income.subscribe((data) => {
            this.ngZone.run(() => {
                this.Incomevalue = data;
            });
        });
        this.Expense.subscribe((data) => {
            this.ngZone.run(() => {
                this.Expensevalue = data;
            });
        });
    }


    handleFiles(form: NgForm) {
        // Check for the various File API support.
        this.accountselected = form.value.account;
        this.DateFormatselected = form.value.DateFormat;
        this.repeateidarray.length=0;
        console.log("Selected Account Number " + this.accountselected);
        console.log("Selected Date format" + this.DateFormatselected);
        var self = this;
        // self.uploadprocess = true;
        self.messageshow = false;
        self.filecontainduplicate = false;
        var files = document.getElementById('files').files;
        console.log(files);
        //for using papa-parse type " meteor add harrison:papa-parse " in console
        Papa.parse(files[0], {
            header: true,
            complete(results, file) {
                // Meteor.call('parseUpload', results.data, self.Incomevalue[0]._id, self.Expensevalue[0]._id, self.accountselected,self.DateFormatselected, (error, response) => {
                //     if (error) {
                //         console.log(error);
                //         // this.uploadfail();
                //         self.ngZone.run(() => {
                //             self.messageshow = true;
                //             self.successmessage = "Document not uploaded ";
                //             self.uploadprocess = false;
                //         });
                //     } else {
                //         self.ngZone.run(() => {
                //             console.log(response);
                //             self.uploadresult=response;
                //             self.processdata(response);
                //             console.log(self.uploadresult);
                //             self.messageshow = true;
                //             self.uploadprocess = false;
                //             self.successmessage = "Document Uploaded Sucessfully";
                //         });
                //     }
                // });

                // console.log(results.data);
                self.checkduplicatetransaction(results.data)
            }
        });
    }

    checkduplicatetransaction(transactionlist: any) {
        console.log(transactionlist);
        for (var i = 0; i < transactionlist.length; i++) {
            for (var j = 0; j < transactionlist.length; j++) {
                if (transactionlist[i]["Transaction ID"] == transactionlist[j]["Transaction ID"] && transactionlist[i]["Cr/Dr"] == transactionlist[j]["Cr/Dr"] && transactionlist[i]["ChequeNo."] == transactionlist[j]["ChequeNo."] && transactionlist[i]["No."] != transactionlist[j]["No."]) {
                    // console.log("this data is repeated");
                    this.repeatarrayid(transactionlist[i]);
                }
            }
        }
        console.log(this.repeateidarray);
        if (this.repeateidarray.length > 0) {
            this.originalarraylist = transactionlist;
            this.duplicatearraylist = _.cloneDeep(transactionlist);
            this.ngZone.run(() => {
                this.filecontainduplicate = true;
            });
        }
        else{
            this.originalarraylist = transactionlist;
            this.duplicatearraylist = transactionlist;
            this.finalupload();
        }
    }

    repeatarrayid(id) {
        // console.log("repeatearrayis called");
        // if (this.repeateidarray.indexOf(id) == -1) {
        //     this.repeateidarray.push(id);
        // }
       this.foundelement=null;
       this.foundelement = _.find(this.repeateidarray, { 'Transaction ID': id['Transaction ID'], 'Cr/Dr': id['Cr/Dr'], 'ChequeNo.':id['ChequeNo.'] });
        if(!this.foundelement){
            this.repeateidarray.push(id);
        }
        else {
            console.log(this.foundelement);
        }
    }

    matchtransaction(id,cr_dr,chequeno) {

        this.foundelement = _.find(this.repeateidarray, { 'Transaction ID': id, 'Cr/Dr': cr_dr, 'ChequeNo.':chequeno });
        if (!this.foundelement) {
            return false;
        } else {
            return true;
        }
    }

    finalupload() {
        console.log("finalupload is called");
        for(let i=0;i<this.repeateidarray.length;i++){
            console.log("executing loop");
            let duplicate=0;
            for(let j=0;j<this.duplicatearraylist.length;j++){
                if(this.repeateidarray[i]["Transaction ID"]==this.duplicatearraylist[j]["Transaction ID"] && this.repeateidarray[i]["Cr/Dr"]==this.duplicatearraylist[j]["Cr/Dr"] && this.repeateidarray[i]["ChequeNo."]==this.duplicatearraylist[j]["ChequeNo."]){
                    if(duplicate==0){
                        duplicate++;
                    }
                    else {
                       this.duplicatearraylist[j]["Transaction ID"]=this.duplicatearraylist[j]["Transaction ID"]+duplicate+duplicate;
                       console.log(this.duplicatearraylist[j]["Transaction ID"]+duplicate+duplicate);
                       console.log(this.duplicatearraylist[j]["Transaction ID"]);
                        duplicate++;
                    }
                }
            }
        }
        console.log("finalvalue that we will upload");
        console.log(this.duplicatearraylist);

        var self = this;
        self.uploadprocess = true;
        self.filecontainduplicate=false;
        Meteor.call('parseUpload', self.duplicatearraylist, self.Incomevalue[0]._id, self.Expensevalue[0]._id, self.accountselected, self.DateFormatselected, (error, response) => {
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
                    self.uploadresult = response;
                    self.processdata(response);
                    console.log(self.uploadresult);
                    self.messageshow = true;
                    self.uploadprocess = false;
                    self.successmessage = "Document Uploaded Sucessfully";
                    self.duplicatearraylist.length=0;
                    self.originalarraylist.length=0;
                    self.filecontainduplicate=false;
                });
            }
        });
    }

    transactionremoved(clickvalue, transactionclickeddata) {
        console.log(clickvalue.target.checked)
        // console.log("this transaction is unselected ");
        console.log(transactionclickeddata);
        if (clickvalue.target.checked == false) {
            for (var i = 0; i < this.duplicatearraylist.length; i++) {
                var obj = this.duplicatearraylist[i];
                if (transactionclickeddata["No."] == obj["No."]) {
                    this.duplicatearraylist.splice(i, 1);
                }
            }
        } else {
            this.duplicatearraylist.push(transactionclickeddata);
        }
        console.log("arraylist value now ");
        console.log(this.duplicatearraylist);
    }

    processdata(response) {
        this.uploadresult["addedstring"] = new Array();
        this.uploadresult["updatedstring"] = new Array();
        var dummyfeed = new Array();
        _.forEach(this.uploadresult.added, function(value, key) {
            var data = {
                "key": key,
                "value": value
            };
            console.log(data);
            dummyfeed.push(data);
        });
        this.uploadresult["addedstring"] = dummyfeed;
        dummyfeed = [];

        _.forEach(this.uploadresult.updated, function(value, key) {
            var data = {
                "key": key,
                "value": value
            };
            console.log(data);
            dummyfeed.push(data);
        });
        this.uploadresult["updatedstring"] = dummyfeed;
    }
    ngOnDestroy() {
        this.headSub.unsubscribe();
        this.accountSub.unsubscribe();
    }
}