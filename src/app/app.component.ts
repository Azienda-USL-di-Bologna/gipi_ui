import { Component } from '@angular/core';
import { GlobalService } from './global-service';

import {keyConverters, EdmLiteral} from 'devextreme/data/odata/utils';
import * as moment from 'moment';
import * as config from 'devextreme/core/config';
import {DEFAULT_CURRENCY, DEFAULT_TIMEZONE_OFFSET} from '../environments/app.constant';

/**
 * @Override
 * Sovrascrivo la funzione standard della classe Date per il ritorno della timezone
 * @returns {number}
 */
// customizzazione per filtri sulla data INIZIO
Date.prototype.getTimezoneOffset = function () {
    return DEFAULT_TIMEZONE_OFFSET;
};

const configObj = {
    defaultCurrency: DEFAULT_CURRENCY,
    forceIsoDateParsing: true
};
config.default(configObj);

keyConverters['DateTime'] = function (value) {
    const formattedDate = moment(value).format('YYYY-MM-DDTHH:mm:ss');
    return new EdmLiteral('datetime\'' + formattedDate + '\'');
};

// customizzazione per filtri sulla data FINE


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GlobalService]
})
export class AppComponent {
  title = 'app';
  constructor(private gs: GlobalService){

  }
}
