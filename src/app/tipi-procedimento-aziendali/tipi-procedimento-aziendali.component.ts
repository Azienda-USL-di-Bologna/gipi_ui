import { Component, OnInit } from "@angular/core";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Router } from "@angular/router";
import { LoggedUser } from "../authorization/logged-user";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import DataSource from "devextreme/data/data_source";
import { Entities } from "environments/app.constants";

@Component({
  selector: "tipi-procedimento-aziendali",
  templateUrl: "./tipi-procedimento-aziendali.component.html",
  styleUrls: ["./tipi-procedimento-aziendali.component.scss"]
})
export class TipiProcedimentoAziendaliComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  public dataSourceProcedimenti: DataSource;
  public loggedUser: LoggedUser;
  public idAzienda: number;
  public descAzienda: string;

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

  
}
