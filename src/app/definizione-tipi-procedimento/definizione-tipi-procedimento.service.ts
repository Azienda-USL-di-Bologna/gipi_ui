import { Injectable } from '@angular/core';
import { ODATA_BASE_URL, odataTipiProcedimentoPath, odataAziendeTipiProcPath } from '../../environments/app.constants';
import { TipoProcedimento } from '../classi/entities/tipo-procedimento';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DefinizioneTipiProcedimentoService {

  public selectedRow: TipoProcedimento;

  constructor(private http: Http) { }

  valorizzaSelectedRow(riga: TipoProcedimento){
    this.selectedRow = riga;
  }

  getTipiProcedimentoSource() {
    return new DataSource({
      store: new ODataStore({
        key: 'idTipoProcedimento',
        url: ODATA_BASE_URL + odataTipiProcedimentoPath,
        //deserializeDates: true,
/*        fieldTypes: {
          id: 'Int32',
        
        },*/
      })
/*      map: function (item) {
        if (item.dataInizioValidita != null)
          item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
        if (item.dataFineValidita != null)
          item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);

        //console.log('item', item);
        return item;
      }*/
    });
  }

  getAziendeAssociateRequest(idTipoProcedimento: string) : Observable<any>{
    let url = ODATA_BASE_URL + odataAziendeTipiProcPath + '?$filter=FK_id_tipo_procedimento eq ' + idTipoProcedimento + '&$expand=idAzienda';
    return this.http.get(url).map(response => response.json().d.results );
  }

}
