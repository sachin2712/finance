// this component is used to genrate report based on category list.
// its a dropdown list where we can select category and subcategory to generate table with total for each month

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
import * as _ from 'lodash';
import * as moment from 'moment';

import {
    Csvdata,
    Gst
} from '../../../../../../both/collections/csvdata.collection';
import {
    accounting
} from 'meteor/iain:accounting';
import template from './gstReport.html';
import 'rxjs/add/operator/toPromise';
@Component({
    selector: 'reportbycategory',
    template
})

export class GstReportComponent implements OnInit, OnDestroy {
    csvdata1: Observable<any[]>;
    csvdata: any;
    csvSub: Subscription;
    date: any;
    monthvalue: any;
    yearvalue: any;
    monthwiselist: any;
    monthwisetotal: any;
    loading: boolean = false;
    gstSub: Subscription;
    constructor(private zone: NgZone, private _router: Router) {}

    ngOnInit() {
        this.date = moment();
        this.monthvalue = this.date.month() + 1;
        this.yearvalue = this.date.year();
        this.loading = true;
        var index = 0;
        var sort_order = {};
        sort_order["Txn_Posted_Date"] = -1;
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        this.gstSub = MeteorObservable.subscribe('gst').subscribe();

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
                Meteor.logout(function (error) {
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
        let count = 0;
        this.csvdata1 = Csvdata.find().zone();
        this.csvdata1.debounceTime(1000).subscribe((csvdata) => {
            this.csvdata = JSON.parse(JSON.stringify(csvdata));
            var monthlist = {};
            var monthtotal = {};
            if (csvdata && csvdata.length) {
                let manageData = (dataForCsv, callback) => {
                    let first_data = dataForCsv.splice(0, 1)[0];
                    this.gstCalculate(first_data).then((data) => {
                        if (this.csvdata[index] != undefined) {
                            this.csvdata[index]['gstPercent'] = (data && (data != false)) ? data['gstPercent'] : '-';
                            this.csvdata[index]['gstNumber'] = (data && (data != false)) ? data['gstNumber'] : '-';
                            var item = this.csvdata[index];
                            var d = new Date(item["Txn_Posted_Date"]);
                            var year = d.getFullYear();
                            var month_value = d.getMonth();
                            var key = month[month_value] + '-' + year;
                            if (!monthlist[key]) {
                                monthlist[key] = [];
                            }
                            if (!monthtotal[key]) {
                                monthtotal[key] = 0;
                            }
                            monthlist[key].push(item);
                            monthtotal[key] += Math.round(accounting.unformat(item["Transaction_Amount(INR)"]) * 100) / 100;
                        }
                    }).then(() => {
                        if (dataForCsv.length) {
                            index++;
                            manageData(dataForCsv, callback);
                        } else {
                            callback(true)
                        }
                    })
                }

                manageData(csvdata, (response) => {
                    var list = [];
                    _.forEach(monthlist, function (value, key) {
                        list.push({
                            "key": key,
                            "value": value
                        })
                    })
                    this.loading = false;
                    this.monthwisetotal = monthtotal;
                    this.monthwiselist = list;
                })
            }
        });
    }


    gstCalculate(first_data: any) {
        return new Promise((resolve, reject) => {
            if (first_data && first_data._id) {
                resolve(Gst.findOne({transaction_id: first_data._id}))
            }
            else {
                resolve(false);
            }
        })
    }
    monthtotalformat(month) {
        return accounting.formatNumber(this.monthwisetotal[month], " ");
    }

    printfunction() {
        window.print();
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.gstSub.unsubscribe();
    }
}
