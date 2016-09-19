import { RouterConfig, provideRouter } from '@angular/router';
import { CsvTimelineComponent } from './imports/csvtimeline/csvtimeline.component';
import { CsvJsonComponent } from './imports/csvjsonparse/csvjson.component';
import { CsvAddProductComponent } from './imports/addproduct/addproduct.component';
import { RegisterComponent } from './imports/registerComponent/register.component';
import { LoginComponent } from './imports/loginComponent/login.component';
import { TemplateComponent } from './imports/csvtimeline/template.component';

//const routes: RouterConfig = [
//
//  { path: '', redirectTo: "login" },
//  { path:'csvtimeline', component:CsvTimelineComponent},
//  { path:'csvjson',  component:CsvJsonComponent},
//  { path:'addcategory', component:CsvAddProductComponent},
//  { path:'login', component:LoginComponent},
//  { path:'register', component:RegisterComponent},
//];

const routes: RouterConfig = [

  { path: '', redirectTo: "login" },
  { path:'login', component:LoginComponent},
  { path:'register', component:RegisterComponent},
  { path:'csvtemplate', component:TemplateComponent,
      children:[
        { path:'', redirectTo:'csvtimeline'},
        { path:'csvtimeline', component:CsvTimelineComponent},
        { path:'csvjson',  component:CsvJsonComponent},
        { path:'addcategory', component:CsvAddProductComponent}
      ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];

