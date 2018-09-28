import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import { GlobalContextService, OdataContextDefinition, OdataContextFactory, ResponseMessages, ErrorMessage } from "@bds/nt-context";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH, TOAST_POSITION, ESITI } from "environments/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import notify from "devextreme/ui/notify";
import { Stato, Iter, EventoIter } from "@bds/nt-entities";
import { Popup } from "@bds/nt-context";
import { PopupRow } from "../classi/condivise/popup/popup-tools";

@Component({
  selector: "app-cambio-di-stato-box",
  templateUrl: "./cambio-di-stato-box.component.html",
  styleUrls: ["./cambio-di-stato-box.component.scss"]
})
export class CambioDiStatoBoxComponent implements OnInit {

  private FASCICOLAZIONE_ERROR: number = 0;
  private dataSourceIter: DataSource;
  private oataContextDefinition: OdataContextDefinition;

  public _sospensioneParams: CambioDiStatoParams;  
  public dataMinimaValida: Date;
  public statiIter: string[];    // string[] = ["Iter in corso", "Apertura sospensione", "Chiusura iter"];
  public _isOpenedAsPopup: boolean;
  public statiIterService: any[] = new Array();
  public _userInfo: UserInfo;
  public showPopupRiassunto: boolean = false;
  public showPopupAnnullamento: boolean = false;
  public dataSourceStati: DataSource;
  public dataIniziale: Date;
  public dataDiOggi: Date = new Date();
  public arrayEsiti: any[] = Object.keys(ESITI).map(key => {return {"codice": key, "descrizione": ESITI[key]}; });
  public arrayRiassunto: PopupRow[];
  public someTextTesto: string = "Il documento è inserito nell'iter come ";
  public loadingVisible: boolean = false;
  public obbligoEsitoMotivazione: boolean = false;
  public dataSourceEventiIter: DataSource;

  @Output() out = new EventEmitter<any>();

  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input()
  set sospensioneParams(value: CambioDiStatoParams) {
    console.log("entrato in set sospensioneParams");
    this._sospensioneParams = value;
    this.setValidazioneObbligoEsitoMotivazione();
    console.log("sosepnsioneParams", this._sospensioneParams);

    if (!this._isOpenedAsPopup && this._sospensioneParams.dataRegistrazioneDocumento && this.dataIniziale === undefined) {
      let dataRegistrazione = new Date(this._sospensioneParams.dataRegistrazioneDocumento);
      let dataAvviamentoIter = new Date(value.dataAvvioIter);

      this.dataIniziale = dataRegistrazione > dataAvviamentoIter ? dataRegistrazione : dataAvviamentoIter;
    }

    let dataRegTemp = new Date(value.dataRegistrazioneDocumento);
    this.dataMinimaValida = dataRegTemp > value.dataAvvioIter ? dataRegTemp : value.dataAvvioIter;
    this.setDataIniziale(new Date(this._sospensioneParams.dataRegistrazioneDocumento));
  }
  get dataMinima(): Date {   
    return this.dataMinimaValida;
  }
  @Input() set isOpenedAsPopup(value: boolean) {
    this._isOpenedAsPopup = value;
    if (this._isOpenedAsPopup) {
      this.dataIniziale = new Date();
    }
  }

  constructor(private odataContextFactory: OdataContextFactory,
    private http: HttpClient, 
    private activatedRoute: ActivatedRoute,
    private globalContextService: GlobalContextService
  ) {
    // bisogna fare il datasource per la lookup dello stato
    this.oataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceStati = new DataSource({
      store: this.oataContextDefinition.getContext()[new Stato().getName()],
    });
    this.statiIter = new Array();
    this.dataSourceStati.load().then(res => {
      res.forEach(element => {
        this.statiIterService.push(element);
        /* E' stato chiesto di mettere la possibilità di aggiungere un documento anche senza cambiare lo stato: secondo me non è giusto, ma...
        if (element.id !== this._sospensioneParams.idStatoCorrente)
          this.statiIter.push(element); 
        */
        this.statiIter.push(element); // se si decommentano le righe sopra, togliere questa!
        // this.statiIter[element.codice] = element;
      });
    });

    /* Esplicita il bind della callback del widget sul componente
     * per dare alla procedura lo scope alle variabili e metodi del componente */
    this.validaData = this.validaData.bind(this); 
    this.reimpostaDataIniziale = this.reimpostaDataIniziale.bind(this);

    this.dataSourceIter = new DataSource({
      store: this.oataContextDefinition.getContext()[new Iter().getName()],
      expand: ["idProcedimento/idAziendaTipoProcedimento"]/* ,
      filter: ["id", "=", this._sospensioneParams.idIter] */
    });
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

  private setValidazioneObbligoEsitoMotivazione(): void {
    if (this._sospensioneParams.codiceStatoProssimo !== "CHIUSO") {
      this.obbligoEsitoMotivazione = false;
      return;
    }
    
    this.dataSourceIter.filter(["id", "=", this._sospensioneParams.idIter]);
    this.dataSourceIter.load().then(res => {
      res.forEach(element => {
        if (element.idProcedimento.idAziendaTipoProcedimento.obbligoEsitoConclusivo) {
          this.obbligoEsitoMotivazione = true;
        } else {
          this.obbligoEsitoMotivazione = false;
        }
      });
    });
  }

  ngOnInit() {
    console.log("ON INIT")
    /* if(this._sospensioneParams.dataRegistrazioneDocumento)
      this.setDataIniziale(this._sospensioneParams.dataRegistrazioneDocumento); */
   }


  handleSubmit(e) {
    // e.preventDefault(); // Con l'evento onClick non dovrebbe essere necessaria
    if (!this._sospensioneParams.dataCambioDiStato && !this._sospensioneParams.codiceStatoCorrente) { return; }

    const result = e.validationGroup.validate(); 
    if (!result.isValid) { return; }
      
    let shippedParams: GestioneStatiParams = {
      idIter : this._sospensioneParams.idIter,
      cfAutore : this._userInfo.cf,
      idAzienda: this._userInfo.idAzienda,
      azione: this._sospensioneParams.azione,
      codiceRegistroDocumento: this._sospensioneParams.codiceRegistroDocumento,
      numeroDocumento: this._sospensioneParams.numeroDocumento,
      annoDocumento: this._sospensioneParams.annoDocumento,
      oggettoDocumento: this._sospensioneParams.oggettoDocumento,
      note: this._sospensioneParams.note,
      statoRichiesto: this._sospensioneParams.codiceStatoProssimo,
      dataEvento: this._sospensioneParams.dataCambioDiStato,
      esito: this._sospensioneParams.esito,
      esitoMotivazione: this._sospensioneParams.esitoMotivazione,
      idOggettoOrigine: this._sospensioneParams.idOggettoOrigine,
      tipoOggettoOrigine: this._sospensioneParams.tipoOggettoOrigine,
      descrizione: this._sospensioneParams.descrizione,
      idApplicazione: this._sospensioneParams.idApplicazione,
      glogParams: this._sospensioneParams.glogParams
    };
    this.loadingVisible = true;

    console.log("PRIMA DI SHIPPARE", shippedParams);

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
    this.statiIter.forEach(value => {
      let stato = value as any;
      objStati[stato.codice] = stato.descrizione;
    });
    this.someTextTesto += STATI[this._sospensioneParams.codiceStatoProssimo];
    this.arrayRiassunto = [];
    // this.arrayRiassunto.push(new PopupRow("codiceRegistroDocumento","Registro", this._sospensioneParams.codiceRegistroDocumento))
    this.arrayRiassunto.push(new PopupRow("oggettoIter", "Oggetto", this._sospensioneParams.oggettoIter));
    this.arrayRiassunto.push(new PopupRow("numeroIter", "Numero", this._sospensioneParams.numeroIter.toString()));
    this.arrayRiassunto.push(new PopupRow("annoIter", "Anno", this._sospensioneParams.annoIter.toString()));

    this.arrayRiassunto.push(new PopupRow("codiceStatoProssimo", "Stato", objStati[this._sospensioneParams.codiceStatoProssimo]));
    if (this._sospensioneParams.dataCambioDiStato) {
      this.arrayRiassunto.push(new PopupRow("dataCambioDiStato", "Data cambio di stato", this._sospensioneParams.dataCambioDiStato.toLocaleDateString()));
    }
    this.arrayRiassunto.push(new PopupRow("note", "Note", this._sospensioneParams.note));
    
    if (this._sospensioneParams.isFaseDiChiusura) {
      this.arrayRiassunto.push(new PopupRow("esito", "Esito", this._sospensioneParams.esito));
      this.arrayRiassunto.push(new PopupRow("esitoMotivazione", "Esito Motivazione", this._sospensioneParams.esitoMotivazione));
    }
  }

  reimpostaDataIniziale(e: any) {
    this.dataIniziale = e.component._options.value;
  }

  validaData(dataAvvio: any): boolean {
    return dataAvvio.value < this.dataMinimaValida ? false : true;
  }


  setDataIniziale(dataRegistrazione: Date) {
    console.log("setDataIniziale --> dataRegistrazione", dataRegistrazione)
    // carico il dataSource di EventiIter
    this.dataSourceEventiIter = new DataSource({
      store: this.oataContextDefinition.getContext()[new EventoIter().getName()],
      expand: ["idEvento"],
      filter: ["idIter.id", "=", this._sospensioneParams.idIter],
      sort: [{field: "dataOraEvento", desc: true}]
    });
    
    // prendo l'ultimo evento utile tra avvio/sospensione/de-sospensione
    this.dataSourceEventiIter.load().then(res => {
      console.log("res",res)

      for (let eventoIter of res){
        console.log("eventoIter.idEvento", eventoIter.idEvento)
        if(dataRegistrazione.getTime() < eventoIter.dataOraEvento.getTime()){
          console.log("eventoIter", eventoIter);
          console.log("RITORNO ", eventoIter.dataOraEvento.getTime() > dataRegistrazione.getTime() ? eventoIter.dataOraEvento : dataRegistrazione)
          this.dataIniziale = eventoIter.dataOraEvento.getTime() > dataRegistrazione.getTime() ? eventoIter.dataOraEvento : dataRegistrazione;
          break;
        }
      }
    });
  }

}

// questi devono essere gli stessi identici parametri che trovo sul server
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

const STATI = {
  SOSPESO: "sospensione",
  IN_CORSO: "riattivazione",
  CHIUSO: "chiusura"
};