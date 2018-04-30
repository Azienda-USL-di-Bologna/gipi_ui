import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import { GlobalContextService, OdataContextDefinition, OdataContextFactory } from "@bds/nt-context";
import { CambioDiStatoParams } from "../classi/condivise/sospensione/gestione-stato-params";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH, TOAST_POSITION } from "environments/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import notify from "devextreme/ui/notify";
import { Stato } from "@bds/nt-entities";
import { Popup } from "@bds/nt-context";
import { PopupRow } from "../classi/condivise/popup/popup-tools";

@Component({
  selector: "app-cambio-di-stato-box",
  templateUrl: "./cambio-di-stato-box.component.html",
  styleUrls: ["./cambio-di-stato-box.component.scss"]
})
export class CambioDiStatoBoxComponent implements OnInit {

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
  public arrayEsiti: any[] = Object.keys(ESITI).map(key => {return {"codice": key, "descrizione": ESITI[key]}});
  public arrayRiassunto: PopupRow[];
  public loadingVisible: boolean = false;

  @Output() out = new EventEmitter<any>();

  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input()
  set sospensioneParams(value: CambioDiStatoParams) {
    this._sospensioneParams = value;
    if (!this._isOpenedAsPopup && this._sospensioneParams.dataRegistrazioneDocumento && this.dataIniziale === undefined) {
      this.dataIniziale = new Date(this._sospensioneParams.dataRegistrazioneDocumento);
    }
    let dataRegTemp = new Date(value.dataRegistrazioneDocumento);
    this.dataMinimaValida = dataRegTemp > value.dataAvvioIter ? dataRegTemp : value.dataAvvioIter;
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
    const oataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceStati = new DataSource({
      store: oataContextDefinition.getContext()[new Stato().getName()],
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
  }

  ngOnInit() { }

  handleSubmit(e) {
  // e.preventDefault(); // Con l'evento onClick non dovrebbe essere necessaria
  if (!this._sospensioneParams.dataCambioDiStato && !this._sospensioneParams.codiceStatoCorrente) { return; }

  const result = e.validationGroup.validate(); 
  if (!result.isValid) { return; }
    
  let shippedParams: GestioneStatiParams = {
    idIter : this._sospensioneParams.idIter,
    cfAutore : this._userInfo.cf,
    idAzienda: this._userInfo.idAzienda,
    azione: "CambioDiStato",
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
    descrizione: this._sospensioneParams.descrizione,
    idApplicazione: this._sospensioneParams.idApplicazione
  };
  this.loadingVisible = true;
  const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/gestisciStatoIter", shippedParams, {headers: new HttpHeaders().set("content-type", "application/json")})
  .subscribe(
    res => {
      this.loadingVisible = false;
        if (res["idIter"] > 0) {
      notify({
        message: "Salvataggio effettuato con successo!",
        type: "success",
        displayTime: 2100,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
      });
      this.updateArrayRiassunto();
      this.showPopupRiassunto = true;
        }
        else {
          notify({
            message: "Salvataggio non riuscito: è già presente un'associazione all'iter con questa bozza di documento.",
            type: "warning",
            displayTime: 2100,
            position: TOAST_POSITION,
            width: TOAST_WIDTH
          });
        }
    },
    err => {
      this.loadingVisible = false;
      notify({
        message: "Errore durante il salvataggio!",
        type: "error",
        displayTime: 2100,
        position: TOAST_POSITION,
        width: TOAST_WIDTH
      });
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
  descrizione: string;
  azione: string;
  idApplicazione: string;
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}

const ESITI = {
  ACCOLTO: "Accolto",
  RIFIUTO_TOTALE: "Rifiuto totale",
  RIFIUTO_PARZIALE: "Rifiuto parziale"
};
