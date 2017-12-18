import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Iter } from 'app/classi/server-objects/entities/iter';
import DataSource from "devextreme/data/data_source";
import { Entities, CUSTOM_RESOURCES_BASE_URL } from 'environments/app.constants';
import { log } from 'util';
import { OdataContextFactory } from "@bds/nt-angular-context";
import { DocumentoIter } from 'app/classi/server-objects/entities/documento-iter';
import { Fase } from "app/classi/server-objects/entities/fase";
import { HttpClient } from "@angular/common/http";
import { element } from "protractor";
import { forEach } from "@angular/router/src/utils/collection";
import { Subscription } from "rxjs/Subscription";
import { Subscriber } from "rxjs/Subscriber";

@Component({
  selector: 'app-passaggio-di-fase',
  templateUrl: './passaggio-di-fase.component.html',
  styleUrls: ['./passaggio-di-fase.component.scss']
})
export class PassaggioDiFaseComponent implements OnInit {

  showStatusOperation(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }

  public iterParams: IterParams = new IterParams();
  public visibile: boolean = false;
  public fase: Fase = new Fase();
  public faseAttuale: string = "";
  public faseSuccessiva: string = "";


  @Input()
  set idIter(idIter: any) {
    this.iterParams.idIter = parseInt(idIter);
  }

  constructor(private http: HttpClient) {
   }

  ngOnInit() { 
    console.log("STO A LOGGAAAAAA!!!")
    console.log(this.iterParams)
    const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?idIter=" + this.iterParams.idIter)
    .subscribe(
      res => {
        let o: any = res;
        var current = JSON.parse(o.currentFase);
        var next = JSON.parse(o.nextFase);
        this.faseAttuale = current.nomeFase;
        this.faseSuccessiva = next.nomeFase;        
      },
      err => {
        this.showStatusOperation("Boh, che sarà successo", "error");
      }
    );


  }

  @Output() messageEvent = new EventEmitter<string>();
  
  procedi() {
    console.log("PROCEDI");
    console.log("faccio roba...");
    console.log(this.iterParams);
    
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/avviaNuovoIter", Object.assign({}, this.iterParams))
      .subscribe(
        res => {
          console.log("Mandato iterParams a Guido!");
          console.log(res);
        },
        err => {
          this.showStatusOperation("Boh, che sarà successo", "error");
        }
      );
    this.sendMessage();   
  }

  annulla(){
    console.log("ANNULLA");
    this.iterParams = undefined;
    this.sendMessage();
  }

  sendMessage() {
    this.visibile = false;
    this.messageEvent.emit("false");
  }

}

export class IterParams{
  idIter: number;
  dataPassaggio: Date;
  codiceRegistroDocumento: string;
  numeroDocumento: string;
  annoDocumento: number;
  notePassaggio: string;
  esito: string;
  motivazioneEsito: string;

}
