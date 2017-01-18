import {
    Component,
    OnInit,
    Input,
    Output,
    OnChanges,
    NgZone
} from '@angular/core';
import {
    UserComponent
} from './userComponent/user.component';
import {
    CategoryComponent
} from './categoryComponent/category.component';
import {
    Row
} from '../../../../../../../both/interfaces/row.model';

import {
    InvoiceComponent
} from './invoiceComponent/invoice.component';
import {
    suggestionComponent
} from './suggestoptionComponent/suggestoption.component';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
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
    Meteor
} from 'meteor/meteor';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    Productcategory,
    Subcategory
} from '../../../../../../../both/collections/csvdata.collection';
import template from './transaction.html';

@Component({
    selector: '[transaction]',
    template
})
@InjectUser('user')
export class TransactionComponent implements OnInit, OnChanges {
    user: Meteor.User;
    Income_id: string;
    Expense_id: string;
    show_head: any;
    change_color: boolean=false;
    transaction_time: any;
    account_code: any;
    locationurl: any;
    account_codestring: string="************";
    @Input() transaction_data: Row;
    @Input() parent_category_array: any;
    @Input() sub_category_array: any;
    @Input() head_array_transaction_list: any;
    @Input() income: any;
    @Input() expense: any;
    @Input() listofaccounts: any;
    @Input() alluserlist: any;
    // isCopied1: boolean = false;
    constructor(private ngZone: NgZone) {}
    ngOnInit() {
        this.locationurl = window.location.origin;
    }
    ngOnChanges(changes: {[ propName: string]: any}) {
       if(changes["income"]){
           this.Income_id = changes["income"].currentValue; 
        }
       if(changes["expense"]){
           this.Expense_id = changes["expense"].currentValue;
        }    

       if(this.transaction_data['Assigned_head_id']!== undefined && this.Income_id!= undefined && this.Expense_id != undefined){
         if (this.transaction_data['Assigned_head_id'] !== this.Income_id && this.transaction_data['Assigned_head_id'] !== this.Expense_id) {
                this.change_color = true;
            }
            else {
                this.change_color=false;
            }
       } 
       if(changes["listofaccounts"] && changes["listofaccounts"].currentValue && this.transaction_data["AssignedAccountNo"]!== undefined){
             this.filteraccount();
       }
 }
 filteraccount(){
     this.account_code = _.filter(this.listofaccounts, {
                    "_id": this.transaction_data["AssignedAccountNo"]
                });
   this.account_codestring = this.account_code[0]? this.account_code[0].Account_no.slice(-4): "not assigned";
 }
 removeTransactionNote(transaction_id){
      Meteor.call('removeTransaction', transaction_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
 }

}