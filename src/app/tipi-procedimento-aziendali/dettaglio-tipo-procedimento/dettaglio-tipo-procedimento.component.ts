import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TipoProcedimento } from "../../classi/server-objects/entities/tipo-procedimento";
import { Procedimento } from "../../classi/server-objects/entities/procedimento";
import { AziendaTipoProcedimento } from "app/classi/server-objects/entities/azienda-tipo-procedimento";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory, GlobalContextService } from "@bds/nt-angular-context";
import { Entities } from "environments/app.constants";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { LoggedUser } from "app/authorization/logged-user";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {
  public proc: AziendaTipoProcedimento;
  public dataSourceTitoli: DataSource;
  public loggedUser: LoggedUser;

  // tslint:disable-next-line:no-input-rename
  @Input()
  set procedimento(procedimento: AziendaTipoProcedimento) {
    console.log("Sono nell'@Input");
    console.log("INPUT PROCEDIMENTO", procedimento);
    this.proc = procedimento;
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(odataContextFactory: OdataContextFactory, globalContextService: GlobalContextService) {
    const odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
    this.loggedUser = globalContextService.getInnerSharedObject("loggedUser")
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nome");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceTitoli = new DataSource({
      store: odataContextDefinition.getContext()[Entities.Titolo.name].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        odataContextDefinition.customLoading(loadOptions);
    }),
      filter: [["idAzienda", "=", this.loggedUser.aziendaLogin.id]]
    });
 
   }

  ngOnInit() {
    console.log("ngOnInit = DettaglioTipoProcedimento", this.proc);
    // console.log("ngOnInit this.proc ---> ", this.proc);
    
  }


  public close() {
    console.log("CLOSE");
    this.messageEvent.emit({visible: false});
  }

  public save() {
    // codice codice codice
    this.close();
  }
}
