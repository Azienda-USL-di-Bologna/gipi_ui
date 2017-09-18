import { Injectable } from '@angular/core';
import {
  ODATA_STORE_ROOT_URL, odataAziendeStruttureTipiProcPath,
  odataTipiProcedimentoPath, odataCompanyPath
} from '../../environments/app.constant'

import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

export class Tab {
  id: number;
  text: string;
  // icon: string;
  content: string;
}

const tabs: Tab[] = [
  {
    id: 0,
    text: 'Dettagli Tipo Procedimento',
    // icon: 'user',
    content: 'User tab content'
  },
  {
    id: 1,
    text: 'Aziende associate',
    // icon: 'comment',
    content: 'Comment tab content'
  }
];


@Injectable()
export class TipiProcedimentoService {

  constructor() {

  }

  public getTabs(): Tab[] {
    return tabs;
  }

  getCompanyStructureProcTypeSource(idTipoProcSelected: number) {
    //debugger;
    if (idTipoProcSelected == null)
      idTipoProcSelected = 0;
    return new DataSource({
      store: new ODataStore({
        key: 'id',
        url: ODATA_STORE_ROOT_URL + odataAziendeStruttureTipiProcPath,
        //'/AziendeStruttureTipiProcedimentos?$expand=TipiProcedimentoDetails,AziendaDetails'


      }),
      onChanged: function () {
        // debugger;
      },
      filter: ['FK_id_tipo_procedimento', '=', + idTipoProcSelected],
      expand: ['idTipoProcedimento', 'idAzienda']
    });
  }


  getCompaniesSource() {
    return new DataSource({
      store: new ODataStore({
        key: 'id',
        url: ODATA_STORE_ROOT_URL + odataCompanyPath
      })
    });
  }

}
