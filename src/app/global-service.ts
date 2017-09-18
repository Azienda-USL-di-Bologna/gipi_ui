import { Injectable } from '@angular/core';
import {
  ODATA_STORE_ROOT_URL, odataAziendeStruttureTipiProcPath,
  odataTipiProcedimentoPath, odataCompanyPath
} from '../environments/app.constant'

import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import ODataContext from 'devextreme/data/odata/context';



@Injectable()
export class GlobalService {
context: ODataContext;


  constructor() {

    this.context = new ODataContext({
      url: ODATA_STORE_ROOT_URL,
      entities: {
        AziendeStruttureTipiProcedimentos: {
          key: "id",
          keyType: "Int32"
        },
        Aziendas: {
          key: "id",
          keyType: "Int32"
        }
      }
    });

  }


getContext(){
  return this.context;
}

  provaVisibilita(){
    console.log('se lo stampa allora vede GlobalService')
  }

}
