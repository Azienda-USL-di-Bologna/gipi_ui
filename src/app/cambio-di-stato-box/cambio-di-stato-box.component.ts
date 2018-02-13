import { Component, OnInit, Input } from '@angular/core';
import DataSource from "devextreme/data/data_source";
import CustomStore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';
import { LoggedUser } from "../authorization/logged-user"
import { GlobalContextService } from "@bds/nt-angular-context/global-context.service";
import { SospensioneParams } from "../classi/condivise/sospensione/sospensione-params"

@Component({
  selector: 'app-cambio-di-stato-box',
  templateUrl: './cambio-di-stato-box.component.html',
  styleUrls: ['./cambio-di-stato-box.component.scss']
})
export class CambioDiStatoBoxComponent {

  public _sospensioneParams : SospensioneParams;
  public statiIter: any[] = ["In corso", "Sospeso", "Chiuso"];
  public prova : DataSource;

  @Input()
  set sospensioneParams(value : SospensioneParams){
    console.log('New value:', value.idIter)
    this._sospensioneParams = value;
  };

  // public loggedUser: LoggedUser;

  constructor() { 
    // let store : CustomStore = new CustomStore({
    //   load: function(a){
    //     return {
    //       data: this.statiIter
    //     }
    //   }
    // });
    // // store.insert("In corso");
    // // store.insert("Sospeso");
    // // store.insert("Chiuso");
    //  let arrayStore = new ArrayStore({
    //   data: this.statiIter,
    //   key: "id"
    // });
    // this.prova = new DataSource({store: arrayStore});
    //  //prova.items = this.statiIter;
    //  console.log('Datasource:', this.prova);
     
   }

   handleSubmit(){
     // Chiamata al server per il cambio di stato
   }


}

// class SospensioneParams {
//   public idIter: number;
//   public idUtente: number;
//   public codiceRegistroDocumento: string;
//   public numeroDocumento: string;
//   public annoDocumento: number;
//   public sospesoDal: Date;
//   public sospesoAl: Date;
//   public note: string;
// }