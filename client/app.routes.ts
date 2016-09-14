import { RouterConfig, provideRouter } from '@angular/router';

//import { PartiesListComponent } from './imports/parties/parties-list.component';
//import { PartyDetailsComponent } from './imports/parties/party-details.component';
//import { TemplateComponent } from './imports/csvtimeline/template.component';
import { CsvTimelineComponent } from './imports/csvtimeline/csvtimeline.component';
import { CsvJsonComponent } from './imports/csvjsonparse/csvjson.component';
import { CsvAddProductComponent } from './imports/addproduct/addproduct.component';

const routes: RouterConfig = [
//  { path: '', component: PartiesListComponent },
//  { path:'party/:partyId', component: PartyDetailsComponent },
//  { path:'csvtemplate', component:TemplateComponent},
//  { path: '', redirectTo:'/csvtimeline'},
  { path: '', redirectTo: "csvtimeline" },
  { path:'csvtimeline', component:CsvTimelineComponent},
  { path:'csvjson',  component:CsvJsonComponent},
  { path:'addcategory', component:CsvAddProductComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];



