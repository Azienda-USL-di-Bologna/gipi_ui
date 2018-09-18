import { Component, OnInit } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition, GlobalContextService, CustomLoadingFilterParams, OdataUtilities } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import { Router } from "@angular/router";
import {Iter, bAzienda, bUtente, GetIterUtente} from "@bds/nt-entities";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { LoggedUser } from "@bds/nt-login";
import { debug } from "util";
import notify from "../../../node_modules/devextreme/ui/notify";
import { TOAST_POSITION, TOAST_WIDTH } from "environments/app.constants";

@Component({
  selector: 'app-lista-iter-per-demiurgo',
  templateUrl: './lista-iter-per-demiurgo.component.html',
  styleUrls: ['./lista-iter-per-demiurgo.component.scss']
})
export class ListaIterPerDemiurgoComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  private subscriptions: Subscription[] = [];
  private cfUtente: string;

  public dataSource: DataSource;
  public loggedUser$: Observable<LoggedUser>;
  public idAzienda: number;

  constructor(private odataContextFactory: OdataContextFactory, private router: Router, private globalContextService: GlobalContextService,
    private odataUtilities: OdataUtilities) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
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
      store: this.odataContextDefinition.getContext()[new Iter().getName()],
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona","idStrutturaResponsabileProcedimento",
        "idProcedimento.idAziendaTipoProcedimento.idAzienda",
        "idUtenteCreazione.idPersona", "idStrutturaUtenteCreazione",
        "idFaseCorrente", "idStato", "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento"],
      sort: [{ field: "numero", desc: true }]
    });
  }

  public cliccalo(e){
    //  console.log(e);
    notify({
      message: "Funzione ancora da implementare",
        type: "warning",
        displayTime: 4100,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
    });
    this.router.navigate(["/iter-procedimento"], { queryParams: { idIter: e.data.id } });
  }
}
