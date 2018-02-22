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
  public aziendaTipoProcedimento: AziendaTipoProcedimento;
  public grid: DxDataGridComponent;
  public screenWidth: number = screen.width;

  constructor(private odataContextFactory: OdataContextFactory, 
    public router: Router,
    public route: ActivatedRoute,
    private globalContextService: GlobalContextService) {

      this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
      this.descAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.descrizione];
      this.idAzienda = this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
      console.log("LOGGO ID AZIENDA", this.idAzienda);


      this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
      this.dataSourceProcedimenti = new DataSource({
        store: this.odataContextDefinition.getContext()[new TipoProcedimento().getName()],    
        expand: ["idAzienda", "idTipoProcedimento", "idTitolo"],
        filter: [["idAzienda.id", "=", this.idAzienda]]
        
      });
      
     console.log("LOGGO DATASOURCE", this.dataSourceProcedimenti);

    }


  ngOnInit() {
  }


  receiveMessage(event: any) {
    console.log("RECEIVE MESSAGE: ", event)
    this.popupVisible = event.visible;
  }

  public handleEvent(event: any) {
    if (event.columnIndex === 4) {
      this.procedimentoDaPassare = event.data;
      console.log("THIS.ROUTE", this.route);
      console.log("handleEvent tipiProcAz: procedimentoDaPassare", this.procedimentoDaPassare);
      this.popupVisible = true;
    }

  }
  
 /*  public openPopup(event: Event) {
    console.log("OPENPOPUP", event);
    console.log("popupVisible? ", this.popupVisible);
    // this.popupVisible = true;
  } */
}
