import { RouterConfig, provideRouter } from '@angular/router';


import { CsvTimelineComponent } from './imports/csvtimeline/csvtimeline.component';
import { CsvJsonComponent } from './imports/csvjsonparse/csvjson.component';
import { CsvAddProductComponent } from './imports/addproduct/addproduct.component';

const routes: RouterConfig = [

  { path: '', redirectTo: "csvtimeline" },
  { path:'csvtimeline', component:CsvTimelineComponent},
  { path:'csvjson',  component:CsvJsonComponent},
  { path:'addcategory', component:CsvAddProductComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];



