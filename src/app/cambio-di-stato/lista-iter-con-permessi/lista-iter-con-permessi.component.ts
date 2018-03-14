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

  private subscriptions: Subscription[] = [];
  private odataContextDefinition: OdataContextDefinition;
  public dataSource: DataSource;
  public customStore: CustomStore;
  public listaItems: any;
  public doc: object = { // Da rivedere in base ai parametri in entrata
    registro: "PG",
    numero: "66",
    anno: 2018,
    oggetto: "bell'oggetto, lo faccio corto, ma non è corto, soprattutto se lo spiego",
    dataRegistrazione: new Date(),
    promotore: "GSLFNSSTICA io sono il proponentre siiii"
  };

  public loggedUser$: Observable<LoggedUser>;
  public _userInfo: UserInfo;


  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Output() selectedRow: EventEmitter<any> = new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient, private globalContextService: GlobalContextService) {
    // console.log("USER INFO LISTA CONSTRACTOR:", this._userInfo);
    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  ngOnInit() {
    // console.log("USER INFO LISTA ONINIT:", this._userInfo);
    // this.recuperaUserInfo();
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new GetIterUtente().getName()],
      customQueryParams: {
        cf: this._userInfo.cf,
        idAzienda: this._userInfo.idAzienda
        // cf: "GSLFNC89A05G224Y", // this._userInfo.cf
        // idAzienda: 2  // this._userInfo.idAzienda
      },
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona", "idFaseCorrente"]
    });
    this.dataSource.load().then(res => { console.log("LISTA RES: ", res); });
}

  selectedRowChanged(e) {
    console.log("SELECTED:", e);
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

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
