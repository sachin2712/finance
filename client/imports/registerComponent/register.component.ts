import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
import template from './registercomponent.html';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { Accounts } from 'meteor/accounts-base';

@Component({
  selector: 'register',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})

export class RegisterComponent implements OnInit {
    addForm: FormGroup;
    
  constructor(private formBuilder: FormBuilder,private _router:Router){ }
  ngOnInit() {
//      *** checking if user is already login ***
    if (Meteor.userId()) {
        this._router.navigate(['/csvtemplate']);
    }
      
      this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  resetForm() {
    this.addForm.controls['name']['updateValue']('');
    this.addForm.controls['email']['updateValue']('');
    this.addForm.controls['password']['updateValue']('');
  }
  
  register() {
      var self=this;
    if (this.addForm.valid) {
//      Parties.insert(this.addForm.value);
        console.log(this.addForm.value);
       Accounts.createUser(this.addForm.value, function(error){
            if (Meteor.user()) {
               console.log(Meteor.userId());
                 self._router.navigate(['/csvtemplate']);
            } else {
               console.log("ERROR: " + error.reason);
            }
         });
         
      // XXX will be replaced by this.addForm.reset() in RC5+
//      this.resetForm();
    }
  }
    
  }
  
  
