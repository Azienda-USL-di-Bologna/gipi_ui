import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {AziendaTipoProcedimento, Titolo} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory, GlobalContextService, OdataContextDefinition } from "@bds/nt-context";
import { LoggedUser } from "app/authorization/logged-user";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { Titolo } from "../../classi/server-objects/entities/titolo";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {
  public proc: AziendaTipoProcedimento = new AziendaTipoProcedimento();
  public proc2: AziendaTipoProcedimento;
  public dataSourceTitoli: DataSource;
  public dataSourceAziendaTipoProcedimento: DataSource;
  public loggedUser: LoggedUser;
  private params: UpdateAziendaTipoProcedimentoParams;

  // tslint:disable-next-line:no-input-rename
  @Input()
  set procedimento(procedimento: AziendaTipoProcedimento) {
    console.log("Sono nell'@Input");
    console.log("INPUT PROCEDIMENTO", procedimento);
    this.proc2 = procedimento;
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private globalContextService: GlobalContextService, private http: HttpClient) {
    const odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
    this.loggedUser = globalContextService.getInnerSharedObject("loggedUser")
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("nome");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceTitoli = new DataSource({
      store: this.odataContextDefinition.getContext()[new Titolo().getName()],
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        odataContextDefinition.customLoading(loadOptions);
    }),
      filter: [["idAzienda", "=", this.loggedUser.aziendaLogin.id]]
    });

/*     this.dataSourceAziendaTipoProcedimento = new DataSource({
      store: this.proc
    });

    console.log("CONSOLE.LOG di this.dataSourceAziendaTipoProcedimento", this.dataSourceAziendaTipoProcedimento) */
   }

  ngOnInit() {
    console.log("ngOnInit = DettaglioTipoProcedimento", this.proc2);
    // console.log("ngOnInit this.proc ---> ", this.proc);
    const odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceAziendaTipoProcedimento = new DataSource({
      store: odataContextDefinition.getContext()[Entities.AziendaTipoProcedimento.name],
      filter: ["id", "=", this.proc2.id],
      expand: ["idTitolo", "idTipoProcedimento", "idAzienda"]

    });
    this.dataSourceAziendaTipoProcedimento.load().then((res) => { this.proc.build(res[0], AziendaTipoProcedimento); console.log("QUESTO E' IL BUILD", this.proc);  });
    console.log("Loggo se mi ha caricato", this.dataSourceAziendaTipoProcedimento);

  }

  public close() {
    console.log("CLOSE");
    this.messageEvent.emit({visible: false, tipoProcedimentoAziendale: this.proc});
  }

  public save() {
    // codice codice codice

    this.dataSourceAziendaTipoProcedimento.store().update(this.proc.id, this.proc);
/* 
  
    let updateAziendaTipoProcedimentoParams = new UpdateAziendaTipoProcedimentoParams();

    updateAziendaTipoProcedimentoParams.aziendaTipoProcedimento = this.proc;
    updateAziendaTipoProcedimentoParams.titolo = this.proc.idTitolo;
    updateAziendaTipoProcedimentoParams.tipoProcedimento = this.proc.idTipoProcedimento;
    updateAziendaTipoProcedimentoParams.messaggio = "Vediamo se funziona"

    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "aziendaTipoProcedimento/updateAziendaTipoProcedimento",
      {proc: updateAziendaTipoProcedimentoParams}, {headers: new HttpHeaders().set("content-type", "application/json")})
      .subscribe(
        res => {
          console.log("----> RES",res);
          notify({
            message: "Salvataggio effettuato con successo!",
            type: "success",
            displayTime: 2100,
            position: {
              my: "center", at: "center", of: window
            },
            width: "max-content"
          });
          console.log("SALVATO")
          this.close();
        },
        error => {
          console.log("CHE CAZZZO SUCCEDE?????");
          notify({
            message: "Errore durante il salvataggio!",
            type: "error",
            displayTime: 2100,
            position: {
              my: "center", at: "center", of: window
          },
          width: "max-content"
          });
        }
      )

     */
  }
}

class UpdateAziendaTipoProcedimentoParams {
  public aziendaTipoProcedimento: AziendaTipoProcedimento;
  public tipoProcedimento: TipoProcedimento;
  public titolo: Titolo;
  public messaggio: string;
  
}
