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
  public popupOrganigrammaVisible = false;
  public loggedUser: LoggedUser;
  public idAzienda: number;
  public descAzienda: string;
  public procedimentoDaPassare: AziendaTipoProcedimento;
  public screenWidth: number = screen.width;
  public aziendaTipiProcedimentoData: any;

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
    this.popupVisible = event.visible;
    let toReload: boolean = event.reloadPadre ? true : false;
    if (toReload)
      this.caricaDataSource();
    // this.procedimentoDaPassare = null;
  }

  public modificaDettagli(event: any, rigaDatagrid: any) {
    if (rigaDatagrid.columnIndex === 4) {
      this.procedimentoDaPassare = rigaDatagrid.data;
      this.popupVisible = true;
      // this.caricaDataSource();
    }
  }

  gestisciAssociazioni(rigaDatagrid: any) {    
    this.router.navigate(["/struttura-tipi-procedimento"], {queryParams: {
      aziendaTipoProcedimento: rigaDatagrid.data.id,
      azienda: rigaDatagrid.data.idAzienda.id,
      tipoProcedimento: rigaDatagrid.data.idTipoProcedimento.nome
    }});
  }

  public  associaOrganigramma(row: any) {
    this.aziendaTipiProcedimentoData = {
      idAzienda: this.idAzienda,
      idAziendaTipoProcedimento: row.data.id,
      headerTipoProcedimento: row.data.idTipoProcedimento.nome
    };
    this.popupOrganigrammaVisible = true;
  }

  public closePopup() {
    this.popupOrganigrammaVisible = false;
  }

  public caricaDataSource() {
    this.dataSourceProcedimenti = new DataSource({
      store: this.odataContextDefinition.getContext()[new AziendaTipoProcedimento().getName()],    
      expand: ["idAzienda", "idTipoProcedimento", "idTitolo"],
      filter: [["idAzienda.id", "=", this.idAzienda]]
      
    });
  }  

  public getWidth() {
    return window.screen.width;
  }

  public getHeight() {
    return window.screen.height;
  }


}
