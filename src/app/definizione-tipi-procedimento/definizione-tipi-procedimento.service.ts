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
        url: ODATA_STORE_ROOT_URL + odataTipiProcedimentoPath
      })
    });
  }

}
