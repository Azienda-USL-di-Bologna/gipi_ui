import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import { GlobalContextService, OdataContextDefinition, OdataContextFactory } from "@bds/nt-context";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import notify from "devextreme/ui/notify";
import { Stato } from "@bds/nt-entities";
import { CODICE_STATI } from "@bds/nt-entities/client-objects/constants/stati-iter";

@Component({
  selector: "app-cambio-di-stato-box",
  templateUrl: "./cambio-di-stato-box.component.html",
  styleUrls: ["./cambio-di-stato-box.component.scss"]
})
export class CambioDiStatoBoxComponent implements OnInit{

  public _sospensioneParams: SospensioneParams;  
  
  public statiIter: any[] = new Array();    // string[] = ["Iter in corso", "Apertura sospensione", "Chiusura iter"];
  public _isOpenedAsPopup: boolean;
  public statiIterService: any[] = new Array();
  public _userInfo: UserInfo;
  public showPopupRiassunto: boolean = false;
  public showPopupAnnullamento: boolean = false;
  public dataSourceStati: DataSource;
  public dataIniziale: Date;

  @Output() out = new EventEmitter<any>();

  @Input() set userInfo(value: UserInfo) {
    this._userInfo = value;
  }
  @Input()
  set sospensioneParams(value: SospensioneParams) {
    this._sospensioneParams = value;
    if (!this._isOpenedAsPopup) {
      this.dataIniziale = new Date(this._sospensioneParams.dataRegistrazioneDocumento);
    }

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
    console.log("costanti: ", CODICE_STATI);
    /* this.statiIterService[this.statiIter[0]] = "iter_in_corso";
    this.statiIterService[this.statiIter[1]] = "apertura_sospensione";
    this.statiIterService[this.statiIter[2]] = "chiusura_iter"; */

    // bisogna fare il datasource per la lookup dello stato
    const oataContextDefinition: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceStati = new DataSource({
      store: oataContextDefinition.getContext()[new Stato().getName()],
    });
    this.dataSourceStati.load().then(res => (res.forEach(element => {
      this.statiIterService.push(element);
      /* E' stato chiesto di mettere la possibilità di aggiungere un documento anche senza cambiare lo stato: secondo me non è giusto, ma...
      if (element.id !== this._sospensioneParams.idStatoCorrente)
        this.statiIter.push(element); 
      */
      this.statiIter.push(element); // se si decommentano le righe sopra, togliere questa!
    })));
    

  }

  ngOnInit() {}


   handleSubmit(e) {
     e.preventDefault();
    if (!this._sospensioneParams.dataCambioDiStato && !this._sospensioneParams.codiceStatoCorrente) {return; }
    
    let shippedParams: ShippedParams = {
      idIter : this._sospensioneParams.idIter,
      idUtente : this._userInfo.idUtente,
      codiceRegistroDocumento: this._sospensioneParams.codiceRegistroDocumento,
      numeroDocumento: this._sospensioneParams.numeroDocumento,
      annoDocumento: this._sospensioneParams.annoDocumento,
      oggettoDocumento: this._sospensioneParams.oggettoDocumento,
      note: this._sospensioneParams.note,
      // stato: this.statiIterService[this._sospensioneParams.idStatoProssimo],
      codiceStato: this._sospensioneParams.codiceStatoProssimo,
      dataEvento: this._sospensioneParams.dataCambioDiStato,
      esito: this._sospensioneParams.esito,
      esitoMotivazione: this._sospensioneParams.esitoMotivazione
    };
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/gestisciStatoIter", shippedParams, {headers: new HttpHeaders().set("content-type", "application/json")})
    .subscribe(
      res => {
        notify({
          message: "Salvataggio effettuato con successo!",
          type: "success",
          displayTime: 2100,
          position: {
            my: "center", at: "center", of: window
          },
          width: "max-content"
        });
        this.showPopupRiassunto = true;
      },
      err => {
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

  handleRiassunto() {
    this.showPopupRiassunto = !this.showPopupRiassunto;
    if (!this._isOpenedAsPopup) {
      window.close();
    }else {
      this.out.emit({ visible: false });
    }
  }

}

interface ShippedParams {
  idIter: number;
  idUtente: number;
  codiceRegistroDocumento: string;
  numeroDocumento: string;
  annoDocumento: number;
  oggettoDocumento: string;
  note: string;
  codiceStato: string;
  dataEvento: Date;
  esito: string;
  esitoMotivazione: string;
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}