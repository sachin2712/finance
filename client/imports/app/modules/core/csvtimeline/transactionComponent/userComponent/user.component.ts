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
    MeteorObservable 
} from 'meteor-rxjs';
import { Users } from '../../../../../../../../both/collections/csvdata.collection';
import { User } from '../../../../../../../../both/models/user.model';

import template from './user.html';

@Component({
    selector: 'user',
    template
})
@InjectUser('user')
export class UserComponent implements OnInit, OnDestroy  {
    userlist: Observable<User>;
    @Input() id: string;
    @Input() assigned_user: string;
    usersData: Subscription;
    user: Meteor.User;
    constructor() {}
    ngOnInit() {     
        this.usersData = MeteorObservable.subscribe('userData').subscribe(() => {  
                 this.userlist=Users.find({}).zone(); 
        });
    }
    assignTransDocToUser(id, userid, username) {
        Meteor.call('assignTransDocToUser', id, userid, username, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        })
    }
     ngOnDestroy() {
    this.usersData.unsubscribe();
  }
}