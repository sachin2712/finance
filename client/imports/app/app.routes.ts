import {
    Route
} from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {
    CsvTimelineComponent
} from './modules/core/csvtimeline/csvtimeline.component';
import {
    CsvJsonComponent
} from './modules/core/csvjsonparse/csvjson.component';
import {
    CsvAddCategoryComponent
} from './modules/core/addcategory/addcategory.component';
import {
    LoginComponent
} from './modules/loginComponent/login.component';
import {
    adduserComponent
} from './modules/core/adduserComponent/adduser.component';
import {
    TemplateComponent
} from './modules/core/template.component';
import {
    DashboardComponent
} from './modules/core/dashboard/dashboard';
import {
    HeadComponent
} from './modules/core/headComponent/head.component';

import {
    ExpenseReportComponent
} from './modules/core/expensereport/expenseReport';
import {
    ReportByHeadComponent
} from './modules/core/reportbyhead/reportbyhead';
import {
    ReportByCategoryComponent
} from './modules/core/reportbycategory/reportbycategory';
import {
    IncomeReportComponent
} from './modules/core/incomereport/incomereport';
import {
    AccountComponent
} from './modules/core/accounts/accounts';
import {
    SharedUrlComponent
} from './modules/uniqueurl/unique.component';


export const routes: Route[] = [{
    path: '',
    redirectTo: "login",
    pathMatch: "full"
}, 
{
    path: 'login',
    component: LoginComponent
}, 
{
    path: 'uniqueurls/:id',
    component: SharedUrlComponent
},
{
    path: 'csvtemplate',
    component: TemplateComponent,
    canActivate: ['canActivateForLoggedIn'],
    children: [
    // {
    //     path: '',
    //     redirectTo: 'dashboard'
    // }, 
    {
        path:'dashboard',
        component: DashboardComponent
    },
    {
        path: 'csvtimeline/:month/:year',
        component: CsvTimelineComponent,
        canActivate: ['canActivateForLoggedIn']
    }, {
        path: 'csvjson',
        component: CsvJsonComponent,
        canActivate: ['canActivateForLoggedIn']
    }, {
        path: 'addcategory',
        component: CsvAddCategoryComponent,
        canActivate: ['canActivateForLoggedIn']
    }, {
        path: 'adduser',
        component: adduserComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'heads',
        component: HeadComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'accounts',
        component: AccountComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'expensereport',
        component: ExpenseReportComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'incomereport',
        component: IncomeReportComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'byreporthead',
        component: ReportByHeadComponent,
        canActivate: ['canActivateForLoggedIn']
    },{
        path: 'reportbycategory',
        component: ReportByCategoryComponent,
        canActivate: ['canActivateForLoggedIn']
    }  
    ]
}];


export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.user()
}];


