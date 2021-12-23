import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {}
}

import * as _ from 'underscore';
import * as moment from 'moment';
declare global {
  interface Window {
    _: any;
    moment: any;
  }
}

window._ = _;
window.moment = moment;
