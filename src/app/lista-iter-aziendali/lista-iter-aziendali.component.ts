import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs/Rx";
import { LoggedUser } from "@bds/nt-login";
import { OdataContextDefinition, OdataContextFactory, GlobalContextService } from "@bds/nt-context";
import { Router } from "@angular/router";
import { bUtente, bAzienda, Iter } from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";

@Component({
  selector: "app-lista-iter-aziendali",
  templateUrl: "./lista-iter-aziendali.component.html",
  styleUrls: ["./lista-iter-aziendali.component.scss"]
})
export class ListaIterAziendaliComponent implements OnInit {
  private odataContextDefinition: OdataContextDefinition;
  private subscriptions: Subscription[] = [];
  private cfUtente: string;

  public dataSource: DataSource;
  public loggedUser$: Observable<LoggedUser>;
  public idAzienda: number;

  constructor(private odataContextFactory: OdataContextFactory, private router: Router, private globalContextService: GlobalContextService) {
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
      store: this.odataContextDefinition.getContext()[new Iter().getName()].on("loaded", test => { console.log("DONE?", test); }),
      expand: ["idResponsabileProcedimento", "idResponsabileProcedimento.idPersona", "idStrutturaResponsabileProcedimento",
        "idProcedimento.idAziendaTipoProcedimento.idAzienda",
        "idUtenteCreazione.idPersona", "idStrutturaUtenteCreazione",
        "idFaseCorrente", "idStato", "idProcedimento.idAziendaTipoProcedimento.idTipoProcedimento"],
      filter: ["idProcedimento.idAziendaTipoProcedimento.idAzienda.id", "=", this.idAzienda],
      sort: [{ field: "numero", desc: true }]
    });
  }

  public goToDetail(e) {
    this.router.navigate(["/iter-procedimento"], { queryParams: { idIter: e.data.id } });
  }
}
