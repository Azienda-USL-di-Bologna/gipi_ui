import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Iter } from "app/classi/server-objects/entities/iter";
// import { UtenteStruttura } from "app/classi/server-objects/entities/utente-struttura";
import { OdataContextFactory } from "@bds/nt-angular-context";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { Entities, CUSTOM_RESOURCES_BASE_URL, afferenzaStruttura } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
// import { forEach } from "@angular/router/src/utils/collection";
import { HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "../../authorization/logged-user";
import { GlobalContextService } from "@bds/nt-angular-context";

@Component({
  selector: "avvia-nuovo-iter",
  templateUrl: "./avvia-nuovo-iter.component.html",
  styleUrls: ["./avvia-nuovo-iter.component.scss"]
})
export class AvviaNuovoIterComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;

  public dataSourceUtenti: any;
  public iterParams: IterParams = new IterParams();
  public nomeProcedimento: string;
  public now: Date = new Date();
  public dataMassimaConclusione: Date;
  public procedimentoMax: number;

  public loggedUser: LoggedUser;


  @Input()
  set procedimentoSelezionato(procedimento: any) {
    this.iterParams = new IterParams();
    this.iterParams.dataCreazioneIter = new Date();
    this.buildProcedimento(procedimento);
  }

  @Input()
  set procedimentoSelezionatoDaDocumento(procedimento: any) {
    this.buildProcedimento(procedimento);
  }

  @Input()
  set documentoSelezionato(doc: any) {
    console.log("Documento ricevuto");
    console.log(doc);
    this.iterParams = new IterParams();
    this.iterParams.codiceRegistroDocumento = doc.registro;
    this.iterParams.numeroDocumento = doc.numero;
    this.iterParams.annoDocumento = doc.anno;
    this.iterParams.oggettoIter = doc.oggetto;
    this.iterParams.dataAvvioIter = new Date(doc.dataRegistrazione);
    this.iterParams.dataCreazioneIter = new Date();
    this.iterParams.promotoreIter = doc.promotore;
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();


  constructor(private odataContextFactory: OdataContextFactory, 
              private http: HttpClient,
              private globalContextService: GlobalContextService) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.getInfoSessionStorage();
  }

  private getInfoSessionStorage() {
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
  }

  private buildProcedimento(procedimento: any) {
    console.log(procedimento);
    if (procedimento != null) {
      this.nomeProcedimento = procedimento.procedimento.idAziendaTipoProcedimento.idTipoProcedimento.nome
        + " (" + procedimento.procedimento.idStruttura.nome + ")";
      this.iterParams.idProcedimento = procedimento.procedimento.id;
      this.iterParams.idAzienda = procedimento.procedimento.idAziendaTipoProcedimento.idAzienda.id;
      // this.dataMassimaConclusione = new Date();
      this.procedimentoMax = procedimento.procedimento.idAziendaTipoProcedimento.durataMassimaProcedimento;
      // this.dataMassimaConclusione.setDate(this.iterParams.dataAvvioIter.getDate() + procedimento.procedimento.idAziendaTipoProcedimento.durataMassimaProcedimento);
    }
  }

  

  private buildDataSourceUtenti() {
    const customOdataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceUtenti = {
      store: customOdataContextDefinition.getContext()[Entities.Utente.name].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        customOdataContextDefinition.customLoading(loadOptions);
      }),
      expand: [
        "idPersona"
      ],
      filter: [["idAzienda.id", "=", this.iterParams.idAzienda], ["attivo", "=", true]],
      paginate: true,
      pageSize: 15
    };
  }

  private campiObbligatoriCompilati() {
    if (this.iterParams.dataAvvioIter == null || this.iterParams.oggettoIter == null || this.iterParams.oggettoIter === "" ||
      this.iterParams.numeroDocumento == null || this.iterParams.annoDocumento == null || this.iterParams.codiceRegistroDocumento == null ||
      this.iterParams.codiceRegistroDocumento === "") {
      this.showStatusOperation("Per avviare un nuovo iter tutti i campi sono obbligatori", "warning");
      return false;
    }
    return true;
  }

  private avviaIter() {
    console.log(this.iterParams);
    if (this.campiObbligatoriCompilati()) {
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({}, this.iterParams))
        .subscribe(
        res => {
          let idIter = +res["idIter"];
          this.closePopUp(idIter);
        },
        err => {
          this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
        );
    }
  }

  private showStatusOperation(message: string, type: string) {
    notify({
      message: message,
      type: type,
      displayTime: 2100,
      position: {
        my: "center", at: "center", of: window
      },
      width: "max-content"
    });
  }

  ngOnInit() {
    /* Chiamo qui questo metodo altrimenti non abbiamo l'idAzienda per filtrare */
    this.buildDataSourceUtenti();
    this.iterParams.idUtenteLoggato = this.loggedUser.idUtente;
  }

  public handleEvent(name: string, data: any) {
    switch (name) {
      case "onClickProcedi":
        this.avviaIter();
        break;
      case "onClickAnnulla":
        this.closePopUp();
        break;
    }
  }

  public closePopUp(idIter?: number) {
    this.messageEvent.emit({ visible: false, idIter: idIter });
  }

  public setDataMax(): Date {
    debugger;
    if (this.procedimentoMax != null && this.iterParams.dataAvvioIter !== undefined) {
      this.dataMassimaConclusione = new Date();
      this.dataMassimaConclusione.setDate(this.iterParams.dataAvvioIter.getDate() + this.procedimentoMax);
    }
    return this.dataMassimaConclusione;
  }

}

class IterParams {
  public idUtenteResponsabile: number;
  public idUtenteLoggato: number;
  /* public idStrutturaUtente: number; */
  public idProcedimento: number;
  public idAzienda: number;
  public oggettoIter: string;
  public dataCreazioneIter: Date;
  public dataAvvioIter: Date;
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public promotoreIter: string;
}