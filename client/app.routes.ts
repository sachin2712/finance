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
    ExpenseReportComponent
} from './modules/core/expensereport/expenseReport';
import {
    IncomeReportComponent
} from './modules/core/incomereport/incomereport';
import {
    HeadComponent
} from './modules/core/headComponent/head.component';
import {
    AccountComponent
} from './modules/core/accounts/accounts';
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
        canActivate: ['canActivateForLoggedIn'],
    }, {
        path: 'csvjson',
        component: CsvJsonComponent
    }, {
        path: 'addcategory',
        component: CsvAddCategoryComponent
    }, {
        path: 'adduser',
        component: adduserComponent
    },{
        path: 'heads',
        component: HeadComponent
    },{
        path: 'accounts',
        component: AccountComponent
    },{
        path: 'expensereport',
        component: ExpenseReportComponent
    },{
        path: 'incomereport',
        component: IncomeReportComponent
    }
    ]
}];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
