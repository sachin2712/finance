import { Component, OnInit } from '@angular/core';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
import template from './adduser.html';
import { MeteorComponent } from 'angular2-meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { matchingPasswords } from './validators';
 
@Component({
  selector: 'adduser',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES]
})
   
export class adduserComponent extends MeteorComponent implements OnInit {
    addForm: FormGroup;
    changePassword: FormGroup;
    userlist: Mongo.Cursor<any>; 
    
  constructor(private formBuilder: FormBuilder){ 
  super();
  }
  ngOnInit() {
     
           Tracker.autorun(function () {
    Meteor.subscribe("userData");

   });

//      *** use // code for Meteor users list ***
//      this.subscribe( () => {
//      this.userlist = Meteor.users.find({});
//      console.log(this.userlist);
//    }, true);
      this.userlist=Meteor.users.find({});
//      **** code for change password ****
      this.changePassword = this.formBuilder.group({
          newPasswords: ['', Validators.required]
      })
//       **** code for add new user ****
      this.addForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      role:['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
      },{validator:matchingPasswords('password','password2')})
    };
  
//  **** resetForm is to reset add user form ****
  resetForm() {
    this.addForm.controls['username']['updateValue']('');
    this.addForm.controls['email']['updateValue']('');
    this.addForm.controls['password']['updateValue']('');
    this.addForm.controls['password2']['updateValue']('');
    this.addForm.controls['role']['updateValue']('');
  }
//  **** reset password is to reset password field ****
   resetPasswordForm(){
      this.changePassword.controls['newPasswords']['updateValue']('');
   }
   
   changePasswords(userId){
       var newPassword = this.changePassword.controls['newPasswords'].value;
       Meteor.call('changepasswordforce',userId,newPassword,(error,response)=>{
           if(error){
               console.log(error.reason);
           }
           else{
               console.log(response);
           }
       });
       this.resetPasswordForm();
   }
//  **** Adduser function is used to add new user ****
  adduser() {
    if (this.addForm.valid) {
//        *** creating adduser variable form new user ***
      var adduser={
      username: this.addForm.controls['username'].value,
      email : this.addForm.controls['email'].value,
      password : this.addForm.controls['password'].value,
      profile  : {
          //publicly visible fields like firstname goes here
                    role:this.addForm.controls['role'].value,
                    name:this.addForm.controls['username'].value,
                    email:this.addForm.controls['email'].value
                   }
      };    
         Meteor.call('adduser',adduser,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
      this.resetForm();
    }
  }
//  **** remove is used to delete a user from user list ***
  removeUser(user){
      Meteor.call('removeuser',user,(error,response)=>{
          if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
      });
      
  }  
  
  }
  