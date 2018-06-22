import { Component, OnInit, Output, Input } from "@angular/core";
import { EventEmitter } from "events";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { OdataContextFactory, GlobalContextService, OdataContextDefinition, ResponseMessages, ErrorMessage } from "@bds/nt-context";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { TOAST_WIDTH, TOAST_POSITION } from "environments/app.constants";
import notify from "devextreme/ui/notify";
import { PopupRow } from "../classi/condivise/popup/popup-tools";


@Component({
  selector: "app-documento-iter-associazione-semplice",
  templateUrl: "./documento-iter-associazione-semplice.component.html",
  styleUrls: ["./documento-iter-associazione-semplice.component.scss"]
})
export class DocumentoIterAssociazioneSempliceComponent implements OnInit {

  private FASCICOLAZIONE_ERROR: number = 0;

  showPopupAnnullamento: boolean;
  arrayRiassunto: any[];
  showPopupRiassunto: boolean;
  loadingVisible: boolean;
  _userInfo: any;
  dataMinimaValida: Date;
  dataIniziale: Date;
  _isOpenedAsPopup: any;
  associazionePrams: CambioDiStatoParams;
  @Output() out = new EventEmitter<any>();

  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input()
  set associaParams(value: CambioDiStatoParams) {
    console.log("SECONDO INPUT");
    console.log("Value", value);
    this.associazionePrams = value;
    this.associazionePrams.codiceStatoProssimo = this.associazionePrams.codiceStatoCorrente;
    // this.associaParams.codiceStatoProssimo = this.associaParams.codiceStatoCorrente;
    if (!this._isOpenedAsPopup && this.associazionePrams.dataRegistrazioneDocumento && this.dataIniziale === undefined) {
      this.dataIniziale = new Date(this.associazionePrams.dataRegistrazioneDocumento);
    }
    let dataRegTemp = new Date(value.dataRegistrazioneDocumento);
    this.dataMinimaValida = dataRegTemp > value.dataAvvioIter ? dataRegTemp : value.dataAvvioIter;
  }
  get dataMinima(): Date {   
    return this.dataMinimaValida;
  }
  @Input() set isOpenedAsPopup(value: boolean) {
    console.log("TERZO INPUT");
    console.log("value", value);
    this._isOpenedAsPopup = value;
    if (this._isOpenedAsPopup) {
      this.dataIniziale = new Date();
    }
  }
  public someTextTesto: string = "Il documento è inserito nell'iter come ";

  constructor(private odataContextFactory: OdataContextFactory,
    private http: HttpClient, 
    private activatedRoute: ActivatedRoute,
    private globalContextService: GlobalContextService) {
      const oataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();

    /* Esplicita il bind della callback del widget sul componente
     * per dare alla procedura lo scope alle variabili e metodi del componente */
    this.validaData = this.validaData.bind(this); 
    this.reimpostaDataIniziale = this.reimpostaDataIniziale.bind(this);
     }

  private showStatusOperation(message: string, type: string) {
    notify({
      message: message,
      type: type,
      displayTime: 2100,
      position: TOAST_POSITION,
      width: TOAST_WIDTH
    });
  }
  ngOnInit() {
    console.log("ngOnInit() -> this.associazionePrams", this.associazionePrams);
    
  }

  handleSubmit(e) {
    // e.preventDefault(); // Con l'evento onClick non dovrebbe essere necessaria
    if (!this.associazionePrams.dataCambioDiStato && this.associazionePrams.numeroDocumento) { return; }
  
    const result = e.validationGroup.validate(); 
    if (!result.isValid) { return; }
      
    let shippedParams: GestioneStatiParams = {
      idIter : this.associazionePrams.idIter,
      cfAutore : this._userInfo.cf,
      idAzienda: this._userInfo.idAzienda,
      azione: this.associazionePrams.azione,
      codiceRegistroDocumento: this.associazionePrams.codiceRegistroDocumento,
      numeroDocumento: this.associazionePrams.numeroDocumento,
      annoDocumento: this.associazionePrams.annoDocumento,
      oggettoDocumento: this.associazionePrams.oggettoDocumento,
      note: this.associazionePrams.note,
      statoRichiesto: this.associazionePrams.codiceStatoProssimo,
      dataEvento: this.associazionePrams.dataCambioDiStato,
      esito: this.associazionePrams.esito,
      esitoMotivazione: this.associazionePrams.esitoMotivazione,
      idOggettoOrigine: this.associazionePrams.idOggettoOrigine,
      tipoOggettoOrigine: this.associazionePrams.tipoOggettoOrigine,
      descrizione: this.associazionePrams.descrizione,
      idApplicazione: this.associazionePrams.idApplicazione,
      glogParams: this.associazionePrams.glogParams
    };
    this.loadingVisible = true;

    console.log("Mo vediamo...", shippedParams);
    // const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/gestisciStatoIter", shippedParams, {headers: new HttpHeaders().set("content-type", "application/json")})
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/gestisciStatoIter", shippedParams, {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      res => {
        this.loadingVisible = false;
        if (res["idIter"] > 0) {
          this.showStatusOperation("Salvataggio effettuato con successo!", "success");
          this.updateArrayRiassunto();
          this.showPopupRiassunto = true;
        }
        else {
          this.showStatusOperation("Salvataggio non riuscito: è già presente un'associazione all'iter con questa bozza di documento.", "warning");
        }
      },
      err => {
        this.loadingVisible = false;
        // console.log("err: ", err);
        if (err.error && err.error.httpCode && err.error.isBdsException) {
          const responseMessages: ResponseMessages = err.error;
          const errorMessages: ErrorMessage[] = responseMessages.errorMessages;
          const errorCode = errorMessages[0].code;
          switch (errorCode) {
            case this.FASCICOLAZIONE_ERROR:
              this.showStatusOperation(errorMessages[0].message, "error");
              break;
            default: // caso generale
              this.showStatusOperation("Errore durante il salvataggio!", "error");
          }
        } else { // se l'errore non è del tipo ResponseMessage, allora mostro un errore generico
            this.showStatusOperation("Errore durante il salvataggio!", "error");
        }
      }
    );
    }
  
    handleClose() {
      if (!this._isOpenedAsPopup) {
        window.close();
      }else {
        this.showPopupAnnullamento = !this.showPopupAnnullamento;
        this.out.emit({ visible: false });
      }
    }
  
    handleAnnulla(e) {
      this.showPopupAnnullamento = !this.showPopupAnnullamento;
    }
  
    handleRiassunto(e: any) {
      this.showPopupRiassunto = !this.showPopupRiassunto;
      if (!this._isOpenedAsPopup) {
        window.close();
      }else {
        this.out.emit({ visible: false });
      }
    }
  
    updateArrayRiassunto() {
      let objStati: string[] = [];
/*       this.statiIter.forEach(value => {
        let stato = value as any;
        objStati[stato.codice] = stato.descrizione;
      }); */
      this.arrayRiassunto = [];
      this.someTextTesto += "associazione semplice";
      // this.arrayRiassunto.push(new PopupRow("codiceRegistroDocumento","Registro", this._sospensioneParams.codiceRegistroDocumento))
      this.arrayRiassunto.push(new PopupRow("oggettoIter", "Oggetto", this.associazionePrams.oggettoIter));
      this.arrayRiassunto.push(new PopupRow("numeroIter", "Numero", this.associazionePrams.numeroIter.toString()));
      this.arrayRiassunto.push(new PopupRow("annoIter", "Anno", this.associazionePrams.annoIter.toString()));
  
      if (this.associazionePrams.dataCambioDiStato) {
        this.arrayRiassunto.push(new PopupRow("dataCambioDiStato", "Data cambio di stato", this.associazionePrams.dataCambioDiStato.toLocaleDateString()));
      }
      this.arrayRiassunto.push(new PopupRow("note", "Note", this.associazionePrams.note));
    }
  
    reimpostaDataIniziale(e: any) {
      console.log("reimpostaDataIniziale(e: any)");
      console.log("this.dataIniziale", this.dataIniziale);
      console.log("e.component._options.value", e.component._options.value);
      this.dataIniziale = e.component._options.value;
    }
  
    validaData(dataAvvio: any): boolean {
      console.log("validaData(dataAvvio: any): boolean ");
      console.log("dataAvvio.value", dataAvvio.value);
      console.log("this.dataMinimaValida", this.dataMinimaValida);
      return dataAvvio.value < this.dataMinimaValida ? false : true;
    }


}

interface GestioneStatiParams {
  statoRichiesto: string;
  idIter: number;
  cfAutore: string;
  idAzienda: number;
  codiceRegistroDocumento: string;
  numeroDocumento: string;
  annoDocumento: number;
  oggettoDocumento: string;
  dataEvento: Date;
  note: string;
  esito: string;
  esitoMotivazione: string;
  idOggettoOrigine: string;
  tipoOggettoOrigine: string;
  descrizione: string;
  azione: string;
  idApplicazione: string;
  glogParams: string;
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}
