import {
    Component,
    OnInit,
    NgZone
} from '@angular/core';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
import {
    Router
} from '@angular/router';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
  SharedNavigationService
} from '../services/navigationbar.service';

import template from './template.html';

@Component({
    selector: 'csvtemplate',
    template
})
@InjectUser('user')
export class TemplateComponent implements OnInit{
    logoutprocess: boolean;
    user: Meteor.User;
    current_date: any;
    current_month: any;
    current_year:any;
    open: boolean = false;
    widthvalue: boolean=false;
    widthvalues: string;
    leftvalues:string;
    constructor(private ngZone: NgZone,private _router: Router, private navvalue: SharedNavigationService) {}

    ngOnInit() {
         this.navvalue.changeEmitted$.subscribe((data)=> {
            console.log(data);
        });
        this.logoutprocess = false;
        this.current_date = new Date();
        this.current_month=this.current_date.getMonth()+1;
        this.current_year=this.current_date.getFullYear();
        if (this.user && this.user.profile.role == 'admin') {
            this._router.navigate(['csvtemplate/dashboard']);
        }
    }
    expend(){
        var self = this;
        self.ngZone.run(() => {
            this.open=!this.open;
        });
    }
    logout() {
        var self = this;
        self.logoutprocess = true;
        // localStorage.removeItem('login_time');
        Meteor.logout(function(error) {
            if (error) {
                console.log("ERROR: " + error.reason);
            } else {
                self._router.navigate(['/login']);
            }
        });
    }
    openMobileMenu() {
      this.ngZone.run(() => {
      this.widthvalue=!this.widthvalue;
      if(this.widthvalue){
          this.widthvalues="200px";
          this.leftvalues = '200px';
      }
      else{
          this.widthvalues="0px";
          this.leftvalues = '18px';
      }
     });
    }
}