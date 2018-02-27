import { Component, OnInit, EventEmitter } from "@angular/core";
import { GlobalContextService, OdataContextFactory, OdataContextDefinition} from "@bds/nt-context";
import { Router, ActivatedRoute } from "@angular/router";
import { LoggedUser } from "@bds/nt-login";
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent } from "devextreme-angular";
import { TipoProcedimento, AziendaTipoProcedimento, bUtente, bAzienda } from "@bds/nt-entities";

@Component({
  selector: "tipi-procedimento-aziendali",
  templateUrl: "./tipi-procedimento-aziendali.component.html",
  styleUrls: ["./tipi-procedimento-aziendali.component.scss"]
})
export class TipiProcedimentoAziendaliComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  public dataSourceProcedimenti: DataSource;
  public popupVisible: boolean = false;
  public loggedUser: LoggedUser;
  public idAzienda: number;
  public descAzienda: string;
  public procedimentoDaPassare: AziendaTipoProcedimento;
  public screenWidth: number = screen.width;

  constructor(private odataContextFactory: OdataContextFactory, 
    public router: Router,
    public route: ActivatedRoute,
    private globalContextService: GlobalContextService) {

      console.log("tipi-procedimento-aziendali CONSTRUCTOR");
      this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
      this.descAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.descrizione];
      this.idAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
      this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();

      this.caricaDataSource();      
    }


  ngOnInit() {
    console.log("tipi-procedimento-aziendali ON INIT");
  }


  receiveMessage(event: any, reloadPadre: boolean) {
    console.log("RECEIVE MESSAGE: ", event)
    this.popupVisible = event.visible;
    let toReload: boolean = reloadPadre ? true : false;
    if(toReload)
      this.caricaDataSource();
    // this.procedimentoDaPassare = null;
  }

  public handleEvent(event: any) {
    console.log("tipi-procedimento-aziendali handleEvent");
    if (event.columnIndex === 4) {
      this.procedimentoDaPassare = event.data;
      console.log("THIS.ROUTE", this.route);
      console.log("handleEvent tipiProcAz: procedimentoDaPassare", this.procedimentoDaPassare.id);
      this.popupVisible = true;
      this.caricaDataSource();
    }
  }

  public caricaDataSource() {
    console.log("tipi-procedimento-aziendali CARICADATASOURCE");
    this.dataSourceProcedimenti = new DataSource({
      store: this.odataContextDefinition.getContext()[new AziendaTipoProcedimento().getName()],    
      expand: ["idAzienda", "idTipoProcedimento", "idTitolo"],
      filter: [["idAzienda.id", "=", this.idAzienda]]
      
    });
  }

  public getWidth(){
    return window.screen.width;
  }

  public getHeight(){
    return window.screen.height;
  }
}
