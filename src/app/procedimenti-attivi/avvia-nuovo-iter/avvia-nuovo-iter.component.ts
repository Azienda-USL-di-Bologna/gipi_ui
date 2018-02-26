import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Utente, bUtente, bAzienda, Procedimento } from "@bds/nt-entities";
import { OdataContextFactory } from "@bds/nt-context";
import { OdataContextDefinition } from "@bds/nt-context";
import { CustomLoadingFilterParams } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";

@Component({
  selector: "avvia-nuovo-iter",
  templateUrl: "./avvia-nuovo-iter.component.html",
  styleUrls: ["./avvia-nuovo-iter.component.scss"]
})
export class AvviaNuovoIterComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  
  public avviaIterDaDocumento: boolean;
  public dataSourceUtenti: any;
  public iterParams: IterParams = new IterParams();
  public nomeProcedimento: string;
  public dataMassimaConclusione: Date;
  public loggedUser: LoggedUser;
  public now: Date = new Date();

  @Input()
  set procedimentoSelezionato(procedimento: any) {
    this.iterParams = new IterParams();
    this.iterParams.dataCreazioneIter = new Date();
    this.buildProcedimento(procedimento);
    this.avviaIterDaDocumento = false;
  }

  @Input()
  set procedimentoSelezionatoDaDocumento(procedimento: any) {
    this.buildProcedimento(procedimento);
    this.avviaIterDaDocumento = true;
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

      this.iterParams.procedimento = procedimento.procedimento;
    }
  }

  private buildDataSourceUtenti() {
    const customOdataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSourceUtenti = {
      store: customOdataContextDefinition.getContext()[new Utente().getName()].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        customOdataContextDefinition.customLoading(loadOptions);
      }),
      expand: [
        "idPersona"
      ],
      filter: ["idAzienda.id", "=", this.loggedUser.getField(bUtente.aziendaLogin)[bAzienda.id], ["attivo", "=", true]],
        // ["idAzienda.id", "=", this.loggedUser.aziendaLogin.id],
        // ["attivo", "=", true]
      // ],
      paginate: true,
      pageSize: 15
    };
  }

  private campiObbligatoriCompilati() {
    if (this.iterParams.idProcedimento == null) {
      this.showStatusOperation("Per avviare un nuovo iter devi selezionare un procedimento", "warning");
      return false;
    }

    if (this.iterParams.dataAvvioIter == null || this.iterParams.oggettoIter == null || this.iterParams.oggettoIter === "" ||
      this.iterParams.numeroDocumento == null || this.iterParams.annoDocumento == null || this.iterParams.codiceRegistroDocumento == null ||
      this.iterParams.codiceRegistroDocumento === "") {
      this.showStatusOperation("Per avviare un nuovo iter tutti i campi sono obbligatori", "warning");
      return false;
    }
    return true;
  }

  private avviaIter() {
    if (this.campiObbligatoriCompilati()) {
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({}, this.iterParams))
        .subscribe(
          res => {
            if (this.avviaIterDaDocumento) {
              this.showStatusOperation("Nuovo Iter avviato", "success");
            } else {
              let idIter = +res["idIter"];
              this.closePopUp(idIter);
            }
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
    this.iterParams.idUtenteLoggato = this.loggedUser.getField(bUtente.id);
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
    if (this.iterParams.procedimento != null && this.iterParams.dataAvvioIter !== undefined) {
      this.dataMassimaConclusione = new Date();
      this.dataMassimaConclusione.setDate(this.iterParams.dataAvvioIter.getDate() + this.iterParams.procedimento.idAziendaTipoProcedimento.durataMassimaProcedimento);
    }
    return this.dataMassimaConclusione;
  }
}

class IterParams {
  public idUtenteResponsabile: number;
  public idUtenteLoggato: number;
  public idProcedimento: number;
  public oggettoIter: string;
  public dataCreazioneIter: Date;
  public dataAvvioIter: Date;
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public promotoreIter: string;
  public procedimento: Procedimento;
}