import { Component, OnInit } from "@angular/core";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Router } from "@angular/router";
import { LoggedUser } from "../authorization/logged-user";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import DataSource from "devextreme/data/data_source";
import { Entities } from "environments/app.constants";
import { DxDataGridComponent } from "devextreme-angular";
import { TipoProcedimento } from "../classi/server-objects/entities/tipo-procedimento";

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
  public procedimentoDaPassare: TipoProcedimento;
  public grid: DxDataGridComponent;

  constructor(private odataContextFactory: OdataContextFactory, 
    public router: Router,
    private globalContextService: GlobalContextService) {

      const now = new Date();
      this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
      this.descAzienda = this.loggedUser.aziendaLogin.descrizione;
      this.idAzienda = this.loggedUser.aziendaLogin.id;


      this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
      this.dataSourceProcedimenti = new DataSource({
        store: this.odataContextDefinition.getContext()[Entities.TipoProcedimento.name],
        
      });
     console.log("LOGGO DATASOURCE", this.dataSourceProcedimenti);

    }


  ngOnInit() {
    
  }


  handleEvent(event: any) {
    // console.log("EVENTO LOGGING: ...  ", event.data);
    // console.log("EVENTO LOGGING: INDEX->  ", event.row);
    // this.grid.instance.editRow(event.row.rowIndex);
    // this.popupVisible = true;
    this.procedimentoDaPassare = event.data;
    console.log(this.procedimentoDaPassare);

  }
  
  openPopup() {
    console.log("onpopup");
    console.log("popupVisible? ", this.popupVisible);
    this.popupVisible = true;
  }
}
