import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Iter } from 'app/classi/server-objects/entities/iter';
import DataSource from 'devextreme/data/data_source';
import { Entities } from 'environments/app.constants';
import { log } from 'util';
import { OdataContextFactory } from '@bds/nt-angular-context';
import { DocumentoIter } from 'app/classi/server-objects/entities/documento-iter';

@Component({
  selector: 'app-passaggio-di-fase',
  templateUrl: './passaggio-di-fase.component.html',
  styleUrls: ['./passaggio-di-fase.component.scss']
})
export class PassaggioDiFaseComponent implements OnInit {
  public iterParams: IterParams = new IterParams();
  public visibile = false;

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
    this.sendMessage(); 
  }

  annulla(){
    console.log("ANNULLA");
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
