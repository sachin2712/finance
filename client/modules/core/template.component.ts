import {
    Component,
    OnInit
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
    // let year: number = d.getFullYear();
    // let month_value: number = d.getMonth();
    constructor(private _router: Router) {}

    ngOnInit() {
        this.logoutprocess = false;
        this.current_date = new Date();
        this.current_month=this.current_date.getMonth()+1;
        this.current_year=this.current_date.getFullYear();
        console.log(this.user);
        if (this.user && this.user.profile.role != 'admin') {
            this._router.navigate(['csvtemplate/csvtimeline/'+this.current_month+'/'+this.current_year]);
        }
    }
    expend(){
      this.open=!this.open;
    }
    logout() {
        var self = this;
        self.logoutprocess = true;
        localStorage.removeItem('login_time');
        Meteor.logout(function(error) {
            if (error) {
                console.log("ERROR: " + error.reason);
            } else {
                self._router.navigate(['/login']);
            }
        });
    }
}