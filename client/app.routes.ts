import { Route,RouterConfig, provideRouter } from '@angular/router';
import { CsvTimelineComponent } from './imports/csvtimeline/csvtimeline.component';
import { CsvJsonComponent } from './imports/csvjsonparse/csvjson.component';
import { CsvAddProductComponent } from './imports/addproduct/addproduct.component';
import { LoginComponent } from './imports/loginComponent/login.component';
import { adduserComponent } from './imports/adduserComponent/adduser.component';
import { TemplateComponent } from './imports/csvtimeline/template.component';

export const routes: Route[] = [

  { path: '', redirectTo: "login" },
  { path:'login', component:LoginComponent},
  { path:'csvtemplate', component:TemplateComponent,
      children:[
        { path:'', redirectTo:'csvtimeline'},
        { path:'csvtimeline', component:CsvTimelineComponent},
        { path:'csvjson',  component:CsvJsonComponent},
        { path:'addcategory', component:CsvAddProductComponent},
        { path:'adduser', component:adduserComponent}
      ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

