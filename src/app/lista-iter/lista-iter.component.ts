import { Component, OnInit } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, GlobalContextService, CustomLoadingFilterParams, OdataUtilities } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import { Router } from "@angular/router";
import {Iter, bAzienda, bUtente, GetIterUtente} from "@bds/nt-entities";
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
  private cfUtente: string;

  public dataSource: DataSource;
  public loggedUser$: Observable<LoggedUser>;
  public idAzienda: number;

  /* public infoGeneriche: any = {
    azienda: "Caricamento...",
    struttura: "UO DaTer",
    procedimento: "Procedimento A"
  }; */

  constructor(private odataContextFactory: OdataContextFactory, private router: Router, private globalContextService: GlobalContextService,
    private odataUtilities: OdataUtilities) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  ngOnInit() {
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
      this.loggedUser$.subscribe(
          (loggedUser: LoggedUser) => {
            if (loggedUser) {
              this.idAzienda = loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id];
              this.cfUtente = loggedUser.getField(bUtente.codiceFiscale);
            }  
          }
      )
    );

    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new GetIterUtente().getName()]
      .on("loading", (loadOptions) => {
        // console.log("loadOptions_prima", loadOptions);
        this.odataUtilities.filterToCustomQueryParams(["oggetto", "numero", "idStato.descrizione",
          "idResponsabileProcedimento.idPersona.descrizione", "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento.nome"], loadOptions);
        // console.log("loadOptions_dopo", loadOptions);
        }),
      customQueryParams: {
        cf: this.cfUtente,
        idAzienda: this.idAzienda
      },
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona",
        "idFaseCorrente", "idStato", "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento"],
      sort: [{ field: "numero", desc: true }]
    });
  }

  vaiAlDettaglio(e) {
    this.router.navigate(["/iter-procedimento"], { queryParams: { idIter: e.data.id } });
  }

}
