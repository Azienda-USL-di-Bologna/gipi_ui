import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Iter } from 'app/classi/server-objects/entities/iter';
import DataSource from "devextreme/data/data_source";
import { Entities, CUSTOM_RESOURCES_BASE_URL } from 'environments/app.constants';
import { log } from 'util';
import { OdataContextFactory } from "@bds/nt-angular-context";
import { DocumentoIter } from 'app/classi/server-objects/entities/documento-iter';

@Component({
  selector: 'app-passaggio-di-fase',
  templateUrl: './passaggio-di-fase.component.html',
  styleUrls: ['./passaggio-di-fase.component.scss']
})
export class PassaggioDiFaseComponent implements OnInit {
  showStatusOperation(arg0: any, arg1: any): any {
    throw new Error("Method not implemented.");
  }
  http: any;
  public iterParams: IterParams = new IterParams();
  public visibile = false;
  public faseAttuale: string = "Semo qua";
  public faseSuccessiva: string = "Annamo là";

  @Input()
  set idIter(idIter: any) {
    this.iterParams.idIter = parseInt(idIter);
  }

  constructor() {
   }

  ngOnInit() { 
    console.log("STO A LOGGAAAAAA!!!")
    console.log(this.iterParams)
  }

  @Output() messageEvent = new EventEmitter<string>();
  
  procedi() {
    console.log("PROCEDI");
    console.log("faccio roba...");
    console.log(this.iterParams);
    this.sendMessage(); 
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
