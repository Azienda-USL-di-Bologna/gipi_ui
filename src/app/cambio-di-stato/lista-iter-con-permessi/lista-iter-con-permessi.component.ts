import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import { GlobalContextService, OdataContextFactory, OdataContextDefinition } from "@bds/nt-context";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { LoggedUser } from "@bds/nt-login";
import { GetIterUtente } from "@bds/nt-entities";

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
  public doc: any = {
    codiceRegistro: null,
    numeroDocumento: null,
    annoDocumento: null
  };


  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input() set documento(doc: any) {
    this.doc = {
      codiceRegistro: doc.codiceRegistroDocumento,
      numeroDocumento: doc.numeroDocumento,
      annoDocumento: +doc.annoDocumento
    };
  }
  @Output() selectedRow: EventEmitter<any> = new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient, private globalContextService: GlobalContextService) {
    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  ngOnInit() {
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new GetIterUtente().getName()],
      customQueryParams: {
        cf: this._userInfo.cf,
        idAzienda: this._userInfo.idAzienda,
        codiceRegistro: this.doc.codiceRegistro,
        numeroDocumento: this.doc.numeroDocumento,
        annoDocumento: this.doc.annoDocumento,
        stato: ""
      },
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona", "idFaseCorrente", "idStato"]
    });
    this.dataSource.load().then(res => { console.log("LISTA RES: ", res); });
  }

  selectedRowChanged(e) {
    this.selectedRow.emit(e.selectedRowsData[0]);
  }

  customizeColumns(columns: any) {
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
  }
}

interface UserInfo {
  idUtente: number;
  cf: string;
  idAzienda: number;
}
