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
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-passaggio-di-fase",
  templateUrl: "./passaggio-di-fase.component.html",
  styleUrls: ["./passaggio-di-fase.component.scss"]
})
export class PassaggioDiFaseComponent implements OnInit {



  public iterParams: IterParams = new IterParams();
  public visibile: boolean = false;
  public fase: Fase = new Fase();
  public passaggioFaseParams: PassaggioFaseParams;
  public showPopupAnnullamento : boolean = false;
  public messaggioAnnullamento : string;
  public dataIniziale: Date;

  @Input() set idIter(value: number) {
    this.iterParams.idIter = value;
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.iterParams.idIter)
    .subscribe(
    res => {
      this.passaggioFaseParams = {
        currentFaseName : JSON.parse(res["currentFase"]).nomeFase,
        nextFaseName : JSON.parse(res["nextFase"]).nomeFase,
        isNextFaseDiChiusura : JSON.parse(res["nextFase"]).faseDiChiusura,


      }
    },
    err => {

      notify("Non esiste la fase successiva", "error", 1000);
    });
  }

  @Input("isOpenedAsPopup") isOpenedAsPopup?: boolean;




  @Output() out = new EventEmitter<any>();


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {}

  showStatusOperation(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }
  
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.iterParams.codiceRegistroDocumento = queryParams["registro"];
      this.iterParams.numeroDocumento = queryParams["numero"];
      this.iterParams.annoDocumento = queryParams["anno"];
      console.log("oggetto", queryParams["oggetto"])
      this.iterParams.oggettoDocumento = queryParams["oggetto"];
      if (queryParams["dataRegistrazione"]) {
          this.dataIniziale = queryParams["dataRegistrazione"];
      } else {
          this.dataIniziale = new Date();
      }


    });
    
    this.passaggioFaseParams = {
      currentFaseName : "",
      nextFaseName : "",
      isNextFaseDiChiusura : false
    }
  }

  procedi() {
    if (!this.isOpenedAsPopup) {
      if (!this.iterParams.idIter) {
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
    console.log(this.iterParams);
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/stepOn", this.iterParams, { headers: new HttpHeaders().set("content-type", "application/json") }) // Object.assign({},)
      .subscribe(
      res => {
        notify({message: "Proceduto con successo", type: "success", displayTime: 3000, position: {my: "center", at: "center", of: window}}); 
        if (!this.isOpenedAsPopup) { 
          setTimeout(() => { window.close(); }, 4000);
        } else {
          this.out.emit({ visible: false, proceduto: true });
        }
      },
      err => {
        if (!this.isOpenedAsPopup) {
          notify({
            message: "Si è verificato un errore durante il procedi",
            type: "error",
            displayTime: 1000,
            position: {
              my: "center", at: "center", of: window
            },
            width: "max-content"
          });
          console.error("Errore:", err);
        } else {
          this.out.emit({ visible: false, proceduto: false });
          notify({
            message: "Si è verificato un errore durante il procedi",
            type: "error",
            displayTime: 1000,
            position: {
              my: "center", at: "center", of: window
            },
            width: "max-content"
          });
          console.error("Errore:", err);
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



  handleAnnulla(e) {
      this.showPopupAnnullamento = !this.showPopupAnnullamento;
  }

  handleClose() {
    if (!this.isOpenedAsPopup) {
      window.close();
    }else {
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
  oggettoDocumento: string;
  notePassaggio: string;
  esito: string;
  motivazioneEsito: string;

}
