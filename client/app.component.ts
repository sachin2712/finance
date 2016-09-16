import { Component } from '@angular/core';
import template from './app.component.html';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'app',
  template,
  styleUrls: ['style.css'],
  directives: [ROUTER_DIRECTIVES]
})

export class AppComponent { }


