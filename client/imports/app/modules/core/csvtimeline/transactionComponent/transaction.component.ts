import {
    Component,
    OnInit,
    Input,
    Output,
    OnChanges,
    OnDestroy,
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
    message
} from '../../../../../../../both/interfaces/message.model';
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
  Roles 
} from 'meteor/alanning:roles';
import {
    Meteor
} from 'meteor/meteor';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    Productcategory,
    Subcategory,
    Comments
} from '../../../../../../../both/collections/csvdata.collection';
import { 
  NgForm 
} from '@angular/forms';
import template from './transaction.html';

@Component({
    selector: '[transaction]',
    template
})
@InjectUser('user')
export class TransactionComponent implements OnInit, OnChanges {

    commentlist: Observable <message[]> ;
    commentSub: Subscription;

    user: Meteor.User;
    adminuseremail: string;
    Income_id: string;
    Expense_id: string;
    show_head: any;
    change_color: boolean=false;
    transaction_time: any;
    account_code: any;
    locationurl: any;
    transactionassigneduser: any;
    account_codestring: string="************";

    dateforemail: any;
    dateforemailmonth: any;
    dateforemailyear: any;

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
        this.dateforemail=new Date();
        this.dateforemailmonth=this.dateforemail.getMonth() + 1;
        this.dateforemailyear=this.dateforemail.getFullYear();
        this.locationurl = window.location.origin;
        this.commentlist = Comments.find({"transactionid":this.transaction_data['_id']}).zone();
        this.commentSub = MeteorObservable.subscribe('Commentslist', this.transaction_data['_id']).subscribe();
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

       if(changes["alluserlist"] && changes["alluserlist"].currentValue){
           this.filteradmin();
       }
 }

 filteradmin(){
   for(var i=0;i<this.alluserlist.length;i++){
       if (Roles.userIsInRole(this.alluserlist[i]["_id"], 'admin')) {
           this.adminuseremail=this.alluserlist[i]["emails"][0]["address"];
       }
       if(this.alluserlist[i]["_id"] == this.transaction_data["Assigned_user_id"]){
            this.transactionassigneduser=this.alluserlist[i];
            // console.log(this.transactionassigneduser.emails[0].address);
       }
   }

 }

 filteraccount(){
     this.account_code = _.filter(this.listofaccounts, {
                    "_id": this.transaction_data["AssignedAccountNo"]
                });
   this.account_codestring = this.account_code[0]? this.account_code[0].Account_no.slice(-4): "not assigned";
 }
 
 addcomment(form: NgForm){
   if(form.value.comment!=''){
     Comments.insert({
       "transactionid": this.transaction_data["_id"],
       "ownerid": Meteor.userId(),
       "ownername": this.user.username,
       "messagecontent": form.value.comment,
       "createdat": new Date()
     });
     // http://link/csvtemplate/csvtimeline/2/2017?comment_id=S2878923908
     if(this.transactionassigneduser && this.transactionassigneduser.emails){
     if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
         Meteor.call('sendEmail', this.transactionassigneduser.emails[0].address,'admin@excellencetechnologies.com','You have a new comment on transaction '+this.transaction_data['Transaction_ID'],
                 'Hi,<br><br>You have a new comment on transaction '+this.transaction_data['Transaction_ID']+
                 '<br>comment: '+form.value.comment+'<br>'+
                 '<a href="'+this.locationurl+'/csvtemplate/csvtimeline/'+this.dateforemailmonth+'/'+this.dateforemailyear+'?comment_id='+this.transaction_data["_id"]+'">Click here to check</a><br/><br/> '+'Thanks<br>', 
                (error, response)=>{
                 if (error){
                    console.log(error.reason);
                       }
                 else{
                    console.log("An email sent to assigned user successfully");
                   }
           });
         console.log("admin added message");
       } 
       else {
           Meteor.call('sendEmail', this.adminuseremail,'admin@excellencetechnologies.com','You have a new comment on transaction '+this.transaction_data['Transaction_ID'],
                 'Hi,<br><br>You have a new comment on transaction '+this.transaction_data['Transaction_ID']+
                 '<br>comment: '+form.value.comment+'<br>'+
                 '<a href="'+this.locationurl+'/csvtemplate/csvtimeline/'+this.dateforemailmonth+'/'+this.dateforemailyear+'?comment_id='+this.transaction_data["_id"]+'">Click here to check</a><br/><br/> '+'Thanks<br>', 
                (error, response)=>{
                 if (error){
                    console.log(error.reason);
                       }
                 else{
                    console.log("An email sent to admin successfully");
                   }
         });
       }
   }
     form.reset();
  }
 }

  deletecomment(id, ownerid) {
    if(Roles.userIsInRole(Meteor.userId(), 'admin') || Meteor.userId() == ownerid ){
       Comments.remove({"_id": id});
       console.log("message deleted successfully");
    }
 }

 addtosuspenselist(id) {
   Meteor.call('addtosuspenselist', id, (error, response)=>{
           if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            } 
   });
 } 

 removefromsuspenselist(id) {
   Meteor.call('removefromsuspenselist', id, (error, response)=>{
           if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            } 
   });
 }

 removeTransactionNote(transaction_id) {
      Meteor.call('removeTransaction', transaction_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
      });
 }

 ngOnDestroy() {
        this.commentSub.unsubscribe();
    }

}