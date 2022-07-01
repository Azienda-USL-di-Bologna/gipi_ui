import { Injectable } from "@angular/core";
import { ODATA_BASE_URL, odataTipiProcedimentoPath } from "../../environments/app.constants";
import { TipoProcedimento } from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class DefinizioneTipiProcedimentoService {

  public selectedRow: TipoProcedimento;

  constructor(private http: Http) { }

  valorizzaSelectedRow(riga: TipoProcedimento) {
    this.selectedRow = riga;
  }

  getTipiProcedimentoSource() {
    return new DataSource({
      store: new ODataStore({
        key: "idAziendaTipoProcedimento",
        url: ODATA_BASE_URL + odataTipiProcedimentoPath,
      })
    });
  }


}
