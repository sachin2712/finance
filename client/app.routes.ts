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
    CsvAddProductComponent
} from './modules/core/addproduct/addproduct.component';
import {
    LoginComponent
} from './modules/loginComponent/login.component';
import {
    adduserComponent
} from './modules/core/adduserComponent/adduser.component';
import {
    TemplateComponent
} from './modules/core/template.component';

export const routes: Route[] = [{
    path: '',
    redirectTo: "login"
}, {
    path: 'login',
    component: LoginComponent
}, {
    path: 'csvtemplate',
    component: TemplateComponent,
    children: [{
        path: '',
        redirectTo: 'csvtimeline'
    }, {
        path: 'csvtimeline',
        component: CsvTimelineComponent
    }, {
        path: 'csvjson',
        component: CsvJsonComponent
    }, {
        path: 'addcategory',
        component: CsvAddProductComponent
    }, {
        path: 'adduser',
        component: adduserComponent,
        canActivate: ['canActivateForLoggedIn']
    }]
}];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];


//import { Route } from '@angular/router';
//import { Meteor } from 'meteor/meteor';
//
//import { PartiesListComponent } from './parties/parties-list.component';
//import { PartyDetailsComponent } from './parties/party-details.component';
//
//export const routes: Route[] = [
//  { path: '', component: PartiesListComponent },
//  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] }
//];