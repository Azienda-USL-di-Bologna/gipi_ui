import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import { GlobalContextService } from "@bds/nt-context";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Params } from "@angular/router";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-cambio-di-stato-box",
  templateUrl: "./cambio-di-stato-box.component.html",
  styleUrls: ["./cambio-di-stato-box.component.scss"]
})
export class CambioDiStatoBoxComponent implements OnInit{

  public _sospensioneParams: SospensioneParams;
  public _isOpenedAsPopup: boolean;
  public statiIter: string[] = ["Iter in corso", "Apertura sospensione", "Chiusura iter"];
  public statiIterService: string[] = new Array();
  public _userInfo: UserInfo;
  public showPopupRiassunto: boolean = false;
  public showPopupAnnullamento: boolean = false;
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
  @Input()set isOpenedAsPopup(value: boolean) {
        this._isOpenedAsPopup = value;
        if (this._isOpenedAsPopup) {
            this.dataIniziale = new Date();
        }

    }

  constructor(private http: HttpClient) { 
    this.statiIterService[this.statiIter[0]] = "iter_in_corso";
    this.statiIterService[this.statiIter[1]] = "apertura_sospensione";
    this.statiIterService[this.statiIter[2]] = "chiusura_iter";
  }

  ngOnInit() {}


   handleSubmit(e) {
     e.preventDefault();
    if (!this._sospensioneParams.dataCambioDiStato && !this._sospensioneParams.statoCorrente) {return; }

    let shippedParams: ShippedParams = {
      idIter : this._sospensioneParams.idIter,
      idUtente : this._userInfo.idUtente,
      codiceRegistroDocumento: this._sospensioneParams.codiceRegistroDocumento,
      numeroDocumento: this._sospensioneParams.numeroDocumento,
      annoDocumento: this._sospensioneParams.annoDocumento,
      note: this._sospensioneParams.note,
      stato: this.statiIterService[this._sospensioneParams.statoProssimo],
      dataEvento: this._sospensioneParams.dataCambioDiStato,
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
    if(!this._isOpenedAsPopup){
      window.close();
    }else{
      this.showPopupAnnullamento = !this.showPopupAnnullamento;
      this.out.emit({ visible: false });
    }
  }

  handleAnnulla(e) {
    this.showPopupAnnullamento = !this.showPopupAnnullamento;
  }

  handleRiassunto(){
    this.showPopupRiassunto = !this.showPopupRiassunto;
    if(!this._isOpenedAsPopup){
      window.close();
    }else{
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
  note: string;
  stato: string;
  dataEvento: Date;
}

interface UserInfo{
  idUtente: number;
  cf: string;
  idAzienda: number;
}