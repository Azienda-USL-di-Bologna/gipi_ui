import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from "@angular/core";
import { Fase, Iter, DocumentoIter } from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { log } from "util";
import { OdataContextFactory } from "@bds/nt-context";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subscription, Subscriber } from "rxjs";
import { confirm } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-passaggio-di-fase",
  templateUrl: "./passaggio-di-fase.component.html",
  styleUrls: ["./passaggio-di-fase.component.scss"]
})
export class PassaggioDiFaseComponent implements OnInit {



  public iterParams: IterParams = new IterParams();
  public visibile: boolean = false;
  public fase: Fase = new Fase();
  public currentFaseName: string = "";
  public nextFaseName: string = "";
  public isNextFaseDiChiusura: boolean;
  public passaggioFaseParams: PassaggioFaseParams;
  public showPopupAnnullamento : boolean = false;
  public messaggioAnnullamento : string;

  @Input() set idIter(value: number){
    this.iterParams.idIter = value;
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.iterParams.idIter)
    .subscribe(
    res => {
      this.passaggioFaseParams = {
        currentFaseName : JSON.parse(res["currentFase"]).nomeFase,
        nextFaseName : JSON.parse(res["nextFase"]).nomeFase,
        isNextFaseDiChiusura : JSON.parse(res["nextFase"]).faseDiChiusura
      }
    },
    err => {
      notify("Non esiste la fase successiva", "error", 1000);
    });
  }

  @Input("isOpenedAsPopup") isOpenedAsPopup?: boolean;
  @Output() out = new EventEmitter<any>();


  constructor(private http: HttpClient) {}

  showStatusOperation(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }
  
  ngOnInit() { }

  procedi() {
    if(!this.isOpenedAsPopup){
      if(!this.iterParams.idIter){
        notify({
          message: "Selezionare un iter per poter procedere!",
          type: "warning",
          displayTime: 2100,
          position: {
            my: "center", at: "center", of: window
          },
          width: "max-content"
        });
        return;
      }
    }

    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/stepOn", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({},)
      .subscribe(
      res => {
        if(!this.isOpenedAsPopup){
          notify("Proceduto con successo", "success", 1000);
        }else{
          this.out.emit({ visible: false, proceduto: true });
        }
      },
      err => {
        if(!this.isOpenedAsPopup){
          notify("Si è verificato un errore durante il procedi", "error", 1000);
          console.log("Errore:", err);
        }else{
          this.out.emit({ visible: false, proceduto: false });
        }
      });
  }

  showConfirm() {
    confirm("Sei sicuro di voler procedere?", "Conferma").then(dialogResult => {
      if (dialogResult) {
        this.procedi();
      }

    });
  }



  handleAnnulla(e){
      this.showPopupAnnullamento = !this.showPopupAnnullamento;
  }

  handleClose(){
    if(!this.isOpenedAsPopup){
      window.close();
    }else{
      this.showPopupAnnullamento = !this.showPopupAnnullamento;
      this.out.emit({ visible: false, proceduto: false });
    }
  }

  sendMessage(proceduto: boolean) {
    this.visibile = false;
  }

  onFormSubmit(event: Event) {}

}

interface PassaggioFaseParams{
  currentFaseName: string;
  nextFaseName: string;
  isNextFaseDiChiusura: boolean;
}

export class IterParams {
  idIter: number;
  dataPassaggio: Date;
  codiceRegistroDocumento: string;
  numeroDocumento: string;
  annoDocumento: number;
  notePassaggio: string;
  esito: string;
  motivazioneEsito: string;

}
