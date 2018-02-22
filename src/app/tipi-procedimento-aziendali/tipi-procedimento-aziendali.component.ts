import { Component, OnInit, EventEmitter } from "@angular/core";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Router, ActivatedRoute } from "@angular/router";
import { LoggedUser } from "../authorization/logged-user";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import DataSource from "devextreme/data/data_source";
import { Entities } from "environments/app.constants";
import { DxDataGridComponent } from "devextreme-angular";
import { TipoProcedimento } from "../classi/server-objects/entities/tipo-procedimento";
import { AziendaTipoProcedimento } from "../classi/server-objects/entities/azienda-tipo-procedimento";

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
      this.descAzienda = this.loggedUser.aziendaLogin.descrizione;
      this.idAzienda = this.loggedUser.aziendaLogin.id;
      console.log("LOGGO ID AZIENDA", this.idAzienda);


      this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
      this.dataSourceProcedimenti = new DataSource({
        store: this.odataContextDefinition.getContext()[Entities.AziendaTipoProcedimento.name],
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
    if(event.columnIndex === 4){
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
