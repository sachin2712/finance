import 'angular2-meteor-polyfills';
import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { AppComponent } from './app.component';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APP_ROUTER_PROVIDERS } from './app.routes';

bootstrap(AppComponent,[
            disableDeprecatedForms(),
            provideForms(),
            APP_ROUTER_PROVIDERS
            ]);

