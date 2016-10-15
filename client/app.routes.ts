import {
    Route,
    RouterConfig,
    provideRouter
} from '@angular/router';
import {
    CsvTimelineComponent
} from './modules/homepageTemplateComponent/csvtimeline/csvtimeline.component';
import {
    CsvJsonComponent
} from './modules/homepageTemplateComponent/csvjsonparse/csvjson.component';
import {
    CsvAddProductComponent
} from './modules/homepageTemplateComponent/addproduct/addproduct.component';
import {
    LoginComponent
} from './modules/loginComponent/login.component';
import {
    adduserComponent
} from './modules/homepageTemplateComponent/adduserComponent/adduser.component';
import {
    TemplateComponent
} from './modules/homepageTemplateComponent/template.component';

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
        component: adduserComponent
    }]
}];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];