import {
    Component,
    OnInit,
    NgZone
} from '@angular/core';
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
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';
import template from './login.html';

@Component({
    selector: 'login',
    template
})

export class LoginComponent implements OnInit {
    addForm: FormGroup;
    email: string;
    password: string;
    message: string;
    showmessage: boolean = false;
    loginprocess: boolean;
    logintime: any;

    current_date: any;
    current_month: any;
    current_year:any;
    years: number[];
    constructor(private ngZone: NgZone, private formBuilder: FormBuilder, private _router: Router) {

    }

    ngOnInit() {
        this.current_date = new Date();
        this.current_month=this.current_date.getMonth()+1;
        this.current_year=this.current_date.getFullYear();
        //  *** checking if user is already login ***
        if (Meteor.user()) {
            this._router.navigate(['csvtemplate/csvtimeline',this.current_month,this.current_year]);
        }
        this.getYears(-10, 10);
        this.addForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            FYYear: ['Select Financial Year', Validators.required]
        });

        this.loginprocess = false;
    }
    
    getYears(offset: number, range: number){
        this.years = [];
        for (var i = 0; i < range + 1; i++){
            this.years.push(this.current_year + offset + i);
        }
    } 


    login() {
        var self = this;
        self.loginprocess = true;
        if (this.addForm.valid) {
            self.logintime = new Date();
            this.email = this.addForm.controls['email'].value;
            this.password = this.addForm.controls['password'].value;
            if(isNaN(this.addForm.controls['FYYear'].value)){
               this.ngZone.run(() => {
                    this.loginprocess = false;
                    this.showmessage = true;
                    this.message = "Please Select Financial Year";
               });
             }
            else {
               Meteor.loginWithPassword(this.email, this.password, function(error) {
                if (Meteor.user()) {
                    localStorage.setItem("login_time", self.logintime);
                    localStorage.setItem("Selected_financial_year", new Date('04-04-'+self.addForm.controls['FYYear'].value).toString());
                    console.log('04-04-'+self.addForm.controls['FYYear'].value);
                    self._router.navigate(['csvtemplate/csvtimeline',self.current_month,self.current_year]);
                } else {
                    self.ngZone.run(() => {
                        self.loginprocess = false;
                        self.showmessage = true;
                        self.message = error.reason;
                    });
                  }
             });
            }
        }
    }
}