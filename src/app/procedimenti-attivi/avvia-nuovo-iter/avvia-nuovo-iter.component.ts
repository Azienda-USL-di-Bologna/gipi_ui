import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Utente, bUtente, bAzienda, Procedimento, GetUtentiGerarchiaStruttura, Persona, Struttura, UtenteStruttura } from "@bds/nt-entities";
import { OdataContextFactory } from "@bds/nt-context";
import { OdataContextDefinition } from "@bds/nt-context";
import { CustomLoadingFilterParams } from "@bds/nt-context";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_POSITION } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { HttpHeaders } from "@angular/common/http";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { LoggedUser } from "@bds/nt-login";
import { GlobalContextService } from "@bds/nt-context";
import { confirm, custom } from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";
import {OdataUtilities} from "@bds/nt-context";
import { UtilityFunctions } from "../../utility-functions";

@Component({
  selector: "avvia-nuovo-iter",
  templateUrl: "./avvia-nuovo-iter.component.html",
  styleUrls: ["./avvia-nuovo-iter.component.scss"]
})
export class AvviaNuovoIterComponent implements OnInit {

  private odataContextDefinitionFunctionImport: OdataContextDefinition;
  private odataContextDefinition: OdataContextDefinition;

  public avviaIterDaDocumento: boolean;
  public dataSourceUtenti: DataSource;
  public dataSourceUtenteLoggato: DataSource;
  public iterParams: IterParams = new IterParams();
  public nomeProcedimento: string;
  public dataMassimaConclusione: Date;
  public loggedUser: LoggedUser;
  public now: Date = new Date();
  public searchString: string = "";
  public idUtenteDefault: number;
  public descrizioneUtenteResponsabile: string;
  public loadingVisible: boolean = false;
  public dataRegistrazioneDocumento: Date;
  public durataMassimaProcedimentoDaProcedimento: number;

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
    this.iterParams.codiceRegistroDocumento = doc.registro;
    this.iterParams.numeroDocumento = doc.numero;
    this.iterParams.annoDocumento = doc.anno;
    this.iterParams.oggettoDocumento = doc.oggetto;
    this.iterParams.idOggettoOrigine = doc.idOggettoOrigine;
    this.iterParams.descrizione = doc.descrizione;
    this.iterParams.oggettoIter = doc.oggetto;
    this.iterParams.dataAvvioIter = new Date(doc.dataRegistrazione);
    this.dataRegistrazioneDocumento = new Date(doc.dataRegistrazione);
    this.iterParams.dataCreazioneIter = new Date();
    this.iterParams.promotoreIter = doc.promotore;
    this.iterParams.idApplicazione = doc.idApplicazione;
    this.iterParams.glogParams = doc.glogParams;
    this.iterParams.dataRegistrazioneDocumento = this.dataRegistrazioneDocumento;
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient,
              private globalContextService: GlobalContextService, private odataUtilities: OdataUtilities) {
    console.log("avvia-nuovo-iter (constructor)");
    this.odataContextDefinitionFunctionImport = this.odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.getInfoSessionStorage();
    this.buildDataSourceUtenti();
    this.setUtenteResponsabile = this.setUtenteResponsabile.bind(this);
    this.reloadResponsabile = this.reloadResponsabile.bind(this);
  }

  private getInfoSessionStorage(): void {
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
  }

  private buildProcedimento(procedimento: any): void {
    if (procedimento != null) {
      this.nomeProcedimento = procedimento.procedimento.idAziendaTipoProcedimento.idTipoProcedimento.nome
        + " (" + procedimento.procedimento.idStruttura.nome + ")";
      this.iterParams.idProcedimento = procedimento.procedimento.id;
      this.iterParams.procedimento = procedimento.procedimento;
      this.durataMassimaProcedimentoDaProcedimento = procedimento.procedimento.idAziendaTipoProcedimento.durataMassimaProcedimento;
      // this.buildDataSourceUtenti();

      if (this.iterParams.procedimento.idResponsabileAdozioneAttoFinale &&  this.iterParams.procedimento.idStrutturaResponsabileAdozioneAttoFinale) {
        this.iterParams.responsabileAdozioneAttoFinaleDesc = this.iterParams.procedimento.idResponsabileAdozioneAttoFinale.idPersona.descrizione
          + " (" + this.iterParams.procedimento.idStrutturaResponsabileAdozioneAttoFinale.nome + ")";
      }

      if (this.iterParams.procedimento.idTitolarePotereSostitutivo &&  this.iterParams.procedimento.idStrutturaTitolarePotereSostitutivo) {
        this.iterParams.titolarePotereSostitutivoDesc = this.iterParams.procedimento.idTitolarePotereSostitutivo.idPersona.descrizione
          + " (" + this.iterParams.procedimento.idStrutturaTitolarePotereSostitutivo.nome + ")";
      }
    }
  }

  private buildDataSourceUtenti(): void {
    /*
      Il caricamento del datasource per la lookup ha un problema. E' paginato. 
      Se l'utente loggato, che deve essere impostato come utente default, non è presente nella prima tranche di dati
      che il datasource tira su, allora non si riuscirà ad impostare l'utente default.
      Il workaraound consiste nel caricare l'utente loggato ed aggiungerlo qualora non fosse già presente.
    */
    this.dataSourceUtenti = new DataSource({
      store: this.odataContextDefinitionFunctionImport.getContext()[new GetUtentiGerarchiaStruttura().getName()]
      .on("loading", (loadOptions) => {
        this.odataUtilities.filterToCustomQueryParams(["searchString"], loadOptions);
      }),
      customQueryParams: {
        // searchString: ""
      },
      expand: [
        "idUtente/idPersona",
        "idStruttura",
        "idAfferenzaStruttura"
      ]
    });

    this.dataSourceUtenteLoggato = new DataSource({
      store: this.odataContextDefinition.getContext()[new UtenteStruttura().getName()],
      expand: [
        "idUtente.idPersona", 
        "idStruttura", 
        "idAfferenzaStruttura"
      ],
      filter: [
        ["idUtente.id", "=", this.loggedUser.getField(bUtente.id)]
      ]
    });

    // Ora faccio le load dell'utente loggato, e quando ce l'ho faccio la load del datasource.
    // A quel punto a seconda che ci sia o meno aggiungo l'utente loggato al datasource
    this.dataSourceUtenteLoggato.load().then(re => {
      let usLogged = re[0];
      if (re.length > 1) {
        for (let r of re) {
          if (r.idAfferenzaStruttura.id === 1) { // Afferenza diretta
            usLogged = r;
          }
        }
      }
      this.dataSourceUtenti.load().then(res => {
        for (let e of res) {
          if (e.idUtente.id === this.loggedUser.getField(bUtente.id)) {
            res.pop(e);
          }
        }
        for (let r of re) {
          res.push(r);
        }
        this.idUtenteDefault = usLogged.id;
        this.iterParams.idUtenteResponsabile = this.loggedUser.getField(bUtente.id);
        this.descrizioneUtenteResponsabile = usLogged.idUtente.idPersona.descrizione 
          + " (" + usLogged.idStruttura.nome
          + " - " + usLogged.idAfferenzaStruttura.descrizione + ")";
      });
    });
  }

  private isProcedimentoSelected(): boolean {
    if (this.iterParams.idProcedimento == null) {
      this.showStatusOperation("Per avviare un nuovo iter devi selezionare un procedimento", "warning");
      return false;
    }
    /* Con la nuova validazione questa parte non viene utilizzata */
    /* if (this.iterParams.dataAvvioIter == null || this.iterParams.oggettoIter == null || this.iterParams.oggettoIter === "" ||
        this.iterParams.numeroDocumento == null || this.iterParams.annoDocumento == null || this.iterParams.codiceRegistroDocumento == null ||
        this.iterParams.codiceRegistroDocumento === "") {
      this.showStatusOperation("Per avviare un nuovo iter tutti i campi sono obbligatori", "warning");
      return false;
    } */
    return true;
  }

  private avviaIter(): void {
    this.loadingVisible = true;
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({}, this.iterParams))
      .subscribe(
      res => {
        this.loadingVisible = false;
          if (this.avviaIterDaDocumento) {
            this.riepilogaAndChiudi(res);
          } else {
            let idIter = +res["idIter"];
            this.closePopUp(idIter);
          }
        },
      err => {
        this.loadingVisible = false;
          this.showStatusOperation("L'avvio del nuovo iter è fallito. Contattare Babelcare", "error");
        }
      );
  }

  private showStatusOperation(message: string, type: string): void {
    notify({
      message: message,
      type: type,
      displayTime: 2100,
      position: TOAST_POSITION
    });
  }

  private riepilogaAndChiudi(res): void {
    /* let text = "Torna a";
    switch (this.iterParams.codiceRegistroDocumento) {
      case "PG": 
        text += " Pico";
        break;
      case "DETE":
        text += " Dete";
        break;
      case "DELI":
        text += " Deli";
        break;
      default:
        text += "lla Home";
        break;
    } */
    custom({
      title: "Iter avviato con successo", 
      message: this.buildMessaggioRiepilogativo(res), 
      buttons: [{
        type: "default",
        text: "OK",
        onClick: () => {
          window.close();
        }
      }]
    }).show();
  }

  private buildMessaggioRiepilogativo(res: any): string {
    return "<b>E' stato creato l'iter numero:</b> " + res["numero"]
      + "<br><b>Tramite il documento:</b> " + this.iterParams.codiceRegistroDocumento + " " + this.iterParams.numeroDocumento + "/" + this.iterParams.annoDocumento
      + "<br><b>Responsabilie procedimento amministrativo:</b> " + this.descrizioneUtenteResponsabile
      + "<br><b>Data avvio iter:</b> " + UtilityFunctions.formatDateToString(this.iterParams.dataAvvioIter)
      + "<br><b>Data massima conclusione:</b> " + UtilityFunctions.formatDateToString(this.dataMassimaConclusione)
      + "<br><b>Promotore:</b> " + this.iterParams.promotoreIter
      + "<br><b>Oggetto:</b> " + this.iterParams.oggettoIter;
  }

  ngOnInit() {
    
  }

  public handleEvent(name: string, data: any): void {
    switch (name) {
      case "onClickProcedi":
        if (this.isProcedimentoSelected()) {
          const result = data.validationGroup.validate();
          if (result.isValid) {
            this.askConfirmAndExecute("Avvio iter", "Stai avviando un nuovo iter, confermi?", this.avviaIter.bind(this));
          }
        }  
        break;
      case "onClickAnnulla":
        if (this.avviaIterDaDocumento) {
          this.askConfirmAndExecute("Chiudi", "Stai annullando l'avvio dell'iter, confermi?", window.close);
        } else {
          this.closePopUp();
        }
        break;
    }
  }

  public askConfirmAndExecute(title: string, text: string, exe: any): void {
    confirm(text, title).then(dialogResult => {
      if (dialogResult) {
        exe();
      }
    });
  }

  public closePopUp(idIter?: number): void {
    this.messageEvent.emit({ visible: false, idIter: idIter });
  }

  public setDataMax(): void {
    if (this.durataMassimaProcedimentoDaProcedimento && this.dataRegistrazioneDocumento) {
      this.dataMassimaConclusione = new Date();
      // debugger;
      this.dataMassimaConclusione.setDate(this.dataRegistrazioneDocumento.getDate() + this.durataMassimaProcedimentoDaProcedimento);
    }
    
  }

  public getDataMax(): Date {
    this.setDataMax();
    return this.dataMassimaConclusione;
  }

  public getDescrizioneUtente(item: any): string {
    return item ? item.idUtente.idPersona.descrizione 
        + " (" + item.idStruttura.nome
        + " - " + item.idAfferenzaStruttura.descrizione + ")" : null;
  }

  public setUtenteResponsabile(item: any): void {
    /* this.iterParams.idUtenteResponsabile = item ? item.itemData.idUtente.id : null;
    this.idUtenteDefault = item ? item.itemData.id : null;
    this.descrizioneUtenteResponsabile = item ? item.itemData.idUtente.idPersona.descrizione 
      + " (" + item.itemData.idStruttura.nome
      + " - " + item.itemData.idAfferenzaStruttura.descrizione + ")" : null; */
    this.iterParams.idUtenteResponsabile = item ? item.component._options.selectedItem.idUtente.id : null;
    this.idUtenteDefault = item ? item.component._options.selectedItem.id : null;
    this.descrizioneUtenteResponsabile = item ? item.component._options.selectedItem.idUtente.idPersona.descrizione 
      + " (" + item.component._options.selectedItem.idStruttura.nome
      + " - " + item.component._options.selectedItem.idAfferenzaStruttura.descrizione + ")" : null;
  }

  public reloadResponsabile(): void {
    this.dataSourceUtenti.filter(null);
    this.dataSourceUtenti.load();
  }
}

class IterParams {
  public idUtenteResponsabile: number;
  public idUtenteStrutturaResponsabile: number;
  public idProcedimento: number;
  public oggettoIter: string;
  public dataCreazioneIter: Date;
  public dataAvvioIter: Date;
  public codiceRegistroDocumento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public oggettoDocumento: string;
  public idOggettoOrigine: string;
  public descrizione: string;
  public promotoreIter: string;
  public procedimento: Procedimento;
  public titolarePotereSostitutivoDesc: string;
  public responsabileAdozioneAttoFinaleDesc: string;
  public idApplicazione: string;
  public glogParams: string;
  public dataRegistrazioneDocumento: Date;
}