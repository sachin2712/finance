import {
    Component,
    OnInit,
    Input,
    OnDestroy
} from '@angular/core';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import { 
    Observable 
} from 'rxjs/Observable';
import { 
    Subscription 
} from 'rxjs/Subscription';
import { 
  Roles 
} from 'meteor/alanning:roles';
import { 
    MeteorObservable 
} from 'meteor-rxjs';
import { 
    Users,
    Csvdata 
} from '../../../../../../../../both/collections/csvdata.collection';
import { User } from '../../../../../../../../both/models/user.model';

import template from './user.html';

@Component({
    selector: 'user',
    template
})
@InjectUser('user')
export class UserComponent implements OnInit, OnDestroy  {
    // userlist: Observable<User>;
    @Input() transactionno: string;
    @Input() id: string;
    @Input() assigned_user: string;
    @Input() listofusers: any;
    locationurl: any;
    dateforemail: any;

    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;
    // allcsvfile: any;
    // usersData: Subscription;
    user: Meteor.User;
    constructor() {}
    ngOnInit() {   
        this.dateforemail=new Date();
        this.locationurl = window.location.origin;  
        this.csvSub = MeteorObservable.subscribe('csvdata').subscribe();
        // this.usersData = MeteorObservable.subscribe('userData').subscribe(() => {  
        //          this.userlist=Users.find({}).zone(); 
        // });
    }
    assignTransDocToUser(id, user_id, username, useremail) {
        // Meteor.call('assignTransDocToUser', id, user_id, username, (error, response) => {
        //     if (error) {
        //         console.log(error.reason);
        //     } else {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                Csvdata.update({
                    "_id": id
                }, {
                    $set: {
                        "Assigned_user_id": user_id,
                        "Assigned_username": username
                    }
                });
            } else {
                throw new Meteor.Error(403, "Access denied");
            }
        console.log("Sending an email to user to notify him");// you have to call here for email 
        Meteor.call('sendEmail', useremail,'admin@excellencetechnologies.com','Transaction Assign To You From Accounts System',
                    'Hi,<br><br>A new transaction has been assign to you with Transaction No : '+this.transactionno+'. <a href="'+this.locationurl+'/csvtemplate/csvtimeline/'+this.dateforemail.getMonth()+'/'+this.dateforemail.getFullYear()+'?comment_id='+id+'">Click here to check</a>'+
                    '<br>Please upload relevant invoices for the same.'+'<br><br>Thanks<br><br>---- This is an automated message, do not reply', 
                (error, response)=>{
                    if (error) {
                         console.log(error.reason);
                            }
                     else{
                            console.log("An email sent to user successfully");
                          }
                   });
        //     }
        // })
    }
     ngOnDestroy() {
    // this.usersData.unsubscribe();
    this.csvSub.unsubscribe();
  }
}