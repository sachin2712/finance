import { Component, OnInit,OnChanges } from '@angular/core';
import { Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
import { MeteorComponent } from 'angular2-meteor';
//import { Productcategory }   from '../../../both/collections/csvdata.collection';

import template from './template.html';
 

@Component({
  selector: 'csvtemplate',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class TemplateComponent extends MeteorComponent implements OnInit, OnChanges {
     checkloginuser:any;
     logoutprocess:boolean;
//   productlist: Mongo.Cursor<any>;

  constructor(private _router:Router){
   super();
   Tracker.autorun(function () {
     this.checkloginuser = Meteor.user();   
   });
    }
     ngOnChanges() {
         this.checkloginuser = Meteor.user();   
     }

  ngOnInit() {
      this.logoutprocess=false;
//      Meteor.subscribe('csvdata');
//      Meteor.subscribe('Productcategory');
    //    **** for checking user is login or not if not login then navigate to login page ****  
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
//     this.productlist = Productcategory.find();   
    }
     
        this.checkloginuser = Meteor.user();   


  }
  logout(){
      var self = this;
      self.logoutprocess=true;
   Meteor.logout(function(error) {
            if(error) {
               console.log("ERROR: " + error.reason);
               
            }else{
            self._router.navigate(['/login']);
            }
         });
//        this._router.navigate(['/login']);
  }

  
}

