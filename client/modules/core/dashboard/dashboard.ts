import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
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
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import * as moment from 'moment';
import template from './dashboardtemplate.html';
import {
    Graphdata
} from '../../../../both/collections/csvdata.collection';

@Component({
    selector: 'dashboard',
    template
})

export class DashboardComponent implements OnInit, OnDestroy {

    current_year_header: any;
    current_year: number;
    date: any;
    csvdata: any;
    csvSub: Subscription;
    chartData: any = []

        ngOnInit() {
            this.date = moment();
            this.current_year_header = this.date.format('YYYY');
            this.current_year = parseInt(this.current_year_header);
            var options = {
                "year": this.current_year
            };
            this.csvdata = Graphdata.find({}).zone();
            this.csvSub = MeteorObservable.subscribe('csvdata_month', options).subscribe(() => {});
            this.csvdata.subscribe((data) => {
                if (data != '') {
                    this.charData = [{
                        'data': [data[0].January_DR, data[0].February_DR, data[0].March_DR, data[0].April_DR, data[0].May_DR, data[0].June_DR, data[0].July_DR,
                            data[0].August_DR, data[0].September_DR, data[0].October_DR, data[0].November_DR, data[0].December_DR
                        ],
                        'label': 'Deposit'
                    }, {
                        'data': [data[0].January_CR, data[0].February_CR, data[0].March_CR, data[0].April_CR, data[0].May_CR, data[0].June_CR,
                            data[0].July_CR, data[0].August_CR, data[0].September_CR, data[0].October_CR, data[0].November_CR, data[0].December_CR
                        ],
                        'label': 'Credit'
                    }];
                }
            })
        } //**** ngInit ends here ****

        charData = [{
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Deposit'
    }, {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        label: 'Credit'
    }];

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;



    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

        public chartHovered(e: any): void {
            console.log(e);
        }
        // ***** this function we will call on every year change *****
    year_data_sub(newdate: number) {
        if (this.csvSub) {
            this.csvSub.unsubscribe();
        }
        var options = {
            year: newdate
        };
        this.csvdata = Graphdata.find().zone();
        this.csvSub = MeteorObservable.subscribe('csvdata_month', options).subscribe(() => {

        });
        this.csvdata.subscribe((data) => {
            if (data != '') {
                this.charData = [{
                    'data': [data[0].January_DR, data[0].February_DR, data[0].March_DR, data[0].April_DR, data[0].May_DR, data[0].June_DR, data[0].July_DR,
                        data[0].August_DR, data[0].September_DR, data[0].October_DR, data[0].November_DR, data[0].December_DR
                    ],
                    'label': 'Deposit'
                }, {
                    'data': [data[0].January_CR, data[0].February_CR, data[0].March_CR, data[0].April_CR, data[0].May_CR, data[0].June_CR,
                        data[0].July_CR, data[0].August_CR, data[0].September_CR, data[0].October_CR, data[0].November_CR, data[0].December_CR
                    ],
                    'label': 'Credit'
                }];
            } else {
                this.charData = [{
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Deposit'
                }, {
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: 'Credit'
                }];
            }
        })
    }

    yearMinus() {
        this.date.subtract(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    yearPlus() {
        this.date.add(1, 'year');
        this.current_year_header = this.date.format('YYYY');
        this.current_year = parseInt(this.current_year_header);
        this.year_data_sub(this.current_year);
    }

    ngOnDestroy() {
        this.csvSub.unsubscribe();
    }

}