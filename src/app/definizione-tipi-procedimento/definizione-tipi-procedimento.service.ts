import { Injectable } from '@angular/core';
import { ODATA_STORE_ROOT_URL, odataTipiProcedimentoPath } from '../../environments/app.constant';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';






@Injectable()
export class DefinizioneTipiProcedimentoService {
  constructor() { }
  getTipiProcedimentoSource() {

    return new DataSource({
      store: new ODataStore({
        key: 'idTipoProcedimento',
        url: ODATA_STORE_ROOT_URL + odataTipiProcedimentoPath,
        //deserializeDates: true,
        /*fieldTypes: {
          id: 'Int32',
          idAfferenzaStruttura: { 'type': 'Date' }
        },*/
      }),
      map: function (item) {
        if (item.dataInizioValidita != null)
          item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
        if (item.dataFineValidita != null)
          item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);

        //console.log('item', item);
        return item;
      }
    });
  }

}
