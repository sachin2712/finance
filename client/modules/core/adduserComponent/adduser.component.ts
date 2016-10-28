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
import template from './adduser.html';
import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    matchingPasswords
} from './validators';
import { 
    Users 
} from '../../../../both/collections/csvdata.collection';
import { 
    User 
} from '../../../../both/models/user.model';

@Component({
    selector: 'adduser',
    template
})

export class adduserComponent implements OnInit, OnDestroy {
    addForm: FormGroup;
    changePassword: FormGroup;
    userlist:  Observable<User>;
    usersData: Subscription;
    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
 
        this.usersData = MeteorObservable.subscribe('userData').subscribe(() => { 
                 this.userlist=Users.find({}).zone();      
        });

        this.changePassword = this.formBuilder.group({
            newPasswords: ['', Validators.required]
        })
        this.addForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            role: ['', Validators.required],
            password: ['', Validators.required],
            password2: ['', Validators.required]
        }, {
            validator: matchingPasswords('password', 'password2')
        })
    };

    changePasswords(userId) {
        var newPassword = this.changePassword.controls['newPasswords'].value;
        Meteor.call('changePasswordForce', userId, newPassword, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
        this.changePassword.reset();
    }

    addUser() {
        if (this.addForm.valid) {
            var adduser = {
                username: this.addForm.controls['username'].value,
                email: this.addForm.controls['email'].value,
                password: this.addForm.controls['password'].value,
                profile: {
                    role: this.addForm.controls['role'].value,
                    name: this.addForm.controls['username'].value,
                    email: this.addForm.controls['email'].value
                }
            };
            Meteor.call('addUser', adduser, (error, response) => {
                if (error) {
                    console.log(error.reason);
                } else {
                    console.log(response);
                }
            });
            this.addForm.reset();
        }

    }
    removeUser(user) {
        Meteor.call('removeUser', user, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });

    }
    ngOnDestroy() {
    this.usersData.unsubscribe();
  }

}