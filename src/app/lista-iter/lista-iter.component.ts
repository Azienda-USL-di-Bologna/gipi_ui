import { Component, OnInit } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, GlobalContextService } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import { Router } from "@angular/router";
import {Iter, bAzienda, bUtente} from "@bds/nt-entities";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { LoggedUser } from "@bds/nt-login";

@Component({
  selector: "app-lista-iter",
  templateUrl: "./lista-iter.component.html",
  styleUrls: ["./lista-iter.component.scss"]
})
export class ListaIterComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  private subscriptions: Subscription[] = [];
  public dataSource: DataSource;
  
  public loggedUser$: Observable<LoggedUser>;
  public idAzienda: number;

  /* public infoGeneriche: any = {
    azienda: "Caricamento...",
    struttura: "UO DaTer",
    procedimento: "Procedimento A"
  }; */

  constructor(private odataContextFactory: OdataContextFactory, private router: Router, private globalContextService: GlobalContextService) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
      this.loggedUser$.subscribe(
          (loggedUser: LoggedUser) => {
            if (loggedUser)
              this.idAzienda = loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
          }
      )
  );
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new Iter().getName()],
      expand: [
        "idResponsabileProcedimento.idPersona", 
        "idStato",
        "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento"
      ],
      filter: ["idProcedimento.idAziendaTipoProcedimento.idAzienda.id", "=", this.idAzienda]
    });
  }

  vaiAlDettaglio(e) {
    this.router.navigate(["/iter-procedimento"], { queryParams: { idIter: e.data.id } });
  }

}
