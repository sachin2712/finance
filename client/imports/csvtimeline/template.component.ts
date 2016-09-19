import { Component, OnInit } from '@angular/core';
import { Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
//import { Productcategory }   from '../../../both/collections/csvdata.collection';

import template from './template.html';
 

@Component({
  selector: 'csvtemplate',
  template,
  directives: [ROUTER_DIRECTIVES]
})

export class TemplateComponent implements OnInit {
//   productlist: Mongo.Cursor<any>;

  constructor(private _router:Router){ }

  ngOnInit() {
    //    **** for checking user is login or not if not login then navigate to login page ****  
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
//     this.productlist = Productcategory.find();   
    }

  }
  logout(){
      var self = this;
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

