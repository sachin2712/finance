
import { Component, OnInit,OnChanges } from '@angular/core';
import {Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {MeteorComponent} from 'angular2-meteor';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';
import template from './logincomponent.html';
 

@Component({
  selector: 'login',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})

export class LoginComponent extends MeteorComponent implements OnInit {
     addForm: FormGroup;
     email: any;
     password: any;
     message:any;
     showmessage: boolean = false;
     loginprocess: boolean;
     ngOnChanges() {
//         if( Session.get("showmessage")==true)
//          {   console.log("using ngDochekck ");
//              this.showmessage=true;
//              this.message=Session.get("message");
//              console.log(this.message);
//          }
//           if( Session.get("movetohome")==true)
//          {
//              this.showmessage=true;
//              console.log(this.showmessage);
//             this._router.navigate(['/csvtemplate']);
//          }
//          if(this.showmessage==true){
//              console.log("we are getting error somewhere");
//          }
     }
//          Tracker.autorun(() => {
//                        this.zone.run(() => {
//                        this.showmessage; 
//                        this.message;
//            this.party = Parties.findOne(this.partyId);
//                   });                          
//                });   
    constructor(private formBuilder: FormBuilder,private _router:Router){ 
         super();

    // Wrapper for Meteor.autorun
  
     }
   
  ngOnInit() {
//      *** checking if user is already login ***
    if (Meteor.userId()) {
        this._router.navigate(['/csvtemplate']);
    }
      this.addForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginprocess=false;             
  }
   login() {
//        this.loginprocess=true;
        var self = this;
        self.loginprocess=true;
    if (this.addForm.valid) {
        console.log(this.addForm.controls['email'].value); 
        this.email=this.addForm.controls['email'].value;
        this.password=this.addForm.controls['password'].value;
        
       Meteor.loginWithPassword(this.email,this.password, function(error){
            if (Meteor.user()) {
               console.log(Meteor.userId());
               console.log("this meteor username is working");
                 self._router.navigate(['/csvtemplate']);
            } else {
//               console.log("ERROR: " + error.reason);              
//               console.log(this.message);
                  self.loginprocess=false;
                  self.showmessage=true;   
                  self.message=error.reason;  
                  console.log(self.message);
            }
         });
    }
  }
  
    
  }
  