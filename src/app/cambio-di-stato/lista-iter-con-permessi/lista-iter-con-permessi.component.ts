import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import { GlobalContextService, OdataContextFactory, OdataContextDefinition, OdataUtilities } from "@bds/nt-context";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { LoggedUser } from "@bds/nt-login";
import { GetIterUtente } from "@bds/nt-entities";
import { SospensioneParams } from "../../classi/condivise/sospensione/sospensione-params";
import {  STATI } from "@bds/nt-entities";
import { now } from "moment";

@Component({
  selector: "app-lista-iter-con-permessi",
  templateUrl: "./lista-iter-con-permessi.component.html",
  styleUrls: ["./lista-iter-con-permessi.component.scss"]
})
export class ListaIterConPermessiComponent implements OnInit {

  // private subscriptions: Subscription[] = [];
  private odataContextDefinition: OdataContextDefinition;
  public dataSource: DataSource;
  // public customStore: CustomStore;
  // public listaItems: any;
  // public loggedUser$: Observable<LoggedUser>;
  public _userInfo: UserInfo;
  public _sospensioneParams: SospensioneParams;

  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input() set sospensioneParams(value: SospensioneParams) {
    this._sospensioneParams = value;
  }
  @Output() selectedRow: EventEmitter<any> = new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient, 
    private globalContextService: GlobalContextService, private odataUtilities: OdataUtilities) {
    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  ngOnInit() {
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new GetIterUtente().getName()]
      .on("loading", (loadOptions) => {
        // console.log("loadOptions_prima", loadOptions);
        this.odataUtilities.filterToCustomQueryParams(["oggetto", "numero", "idStato.descrizione", "idResponsabileProcedimento.idPersona.descrizione"], loadOptions);
        // console.log("loadOptions_dopo", loadOptions);
      }),
      customQueryParams: {
        cf: this._userInfo.cf,
        idAzienda: this._userInfo.idAzienda,
        codiceRegistro: this._sospensioneParams.codiceRegistroDocumento ? this._sospensioneParams.codiceRegistroDocumento : "",
        numeroDocumento: this._sospensioneParams.numeroDocumento ? this._sospensioneParams.numeroDocumento : "",
        annoDocumento: this._sospensioneParams.annoDocumento ? +this._sospensioneParams.annoDocumento : 0,
        idOggettoOrigine: this._sospensioneParams.idOggettoOrigine ? this._sospensioneParams.idOggettoOrigine : "",
        stato: this._sospensioneParams.azione === "associazione" ? STATI.IN_CORSO + ":" + STATI.SOSPESO : this.getStatoPrecedente(this._sospensioneParams.codiceStatoProssimo),
        dataRegistrazione: this._sospensioneParams.dataRegistrazioneDocumento ? this._sospensioneParams.dataRegistrazioneDocumento : ""
      },
      paginate: true,
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona", "idFaseCorrente", "idStato"]/* ,
      sort: [{ field: "oggetto", desc: true }] */
     });

    /* Commento perché questa istruzione lanciava un'altra richiesta al server */
    // this.dataSource.load().then(res => { console.log("LISTA RES: ", res); }); 
  } 

  selectedRowChanged(e) {
    this.selectedRow.emit(e.selectedRowsData[0]);
  }

  getStatoPrecedente(codiceStatoProssimo): string {
    switch (codiceStatoProssimo){
      case STATI.IN_CORSO: {
        return STATI.SOSPESO; // solo i sospesi possono essere rimessi a in corso
      }
      case STATI.SOSPESO: {
        return STATI.IN_CORSO; // solo gli in_corso possono essere sospesi
      }
      case STATI.CHIUSO: {
        return STATI.IN_CORSO + ":" + STATI.SOSPESO;
      }
    }
  }

/*   customizeColumns(columns: any) {
    columns.forEach(column => {
      const defaultCalculateFilterExpression = column.calculateFilterExpression;
      column.calculateFilterExpression = function(value, selectedFilterOperation) {
        if (this.dataType === "string" && !this.lookup && value) {
          return ["tolower(" + this.dataField + ")",
            selectedFilterOperation || "contains",
            value.toLowerCase()];
        } else {
          return defaultCalculateFilterExpression.apply(this, arguments);
        }
      };
    });
  } */
}

interface UserInfo {
  idUtente: number;
  cf: string;
  idAzienda: number;
}
