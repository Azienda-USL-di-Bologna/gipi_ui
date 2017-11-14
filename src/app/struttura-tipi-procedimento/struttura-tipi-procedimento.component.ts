import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { SharedData } from '../classi/context/shared-data';
import {OdataContextDefinition} from "../classi/context/odata-context-definition";
import { Entities } from "../classi/context/context-utils";
import { Struttura } from "../classi/entities/struttura";
import ODataStore from 'devextreme/data/odata/store';

@Component({
  selector: 'app-struttura-tipi-procedimento',
  templateUrl: './struttura-tipi-procedimento.component.html',
  styleUrls: ['./struttura-tipi-procedimento.component.css']
})
export class StrutturaTipiProcedimentoComponent implements OnInit {

  private datasource: DataSource;
  public strutture: Struttura = new Struttura();
  
  constructor(private sharedData: SharedData, private odataContextDefinition: OdataContextDefinition, private router: Router) {

  //   this.datasource = new DataSource({
  //     store: this.odataContextDefinition.getContext()[Entities.Struttura],
  //     filter: ['FK_id_azienda', '=', 5], //Il valore numerico è l'id dell'azienda, aperto RM per renderlo parametrizzabile
  //   });
  //  }
  
  
  this.datasource = new DataSource({
    store: new ODataStore({
      url: "http://localhost:10006/gipi/odata.svc/GetStruttureByTipoProcedimento?idTipoProcedimento=33&idAzienda=5"
    })
  });
 }  

  ngOnInit() {
  }


  screen(width) {
    return (width < 700) ? 'sm' : 'lg';
  }

  handleEvent(eventName:string, e:Event) {
    switch (eventName) {
      // case 'treeItemSelectionChanged':
      //   this.treeItemSelectionChanged(e);
      //   break;
    }
  }

  // private treeItemSelectionChanged(e) {
  //   this.emitTreeNodeSelected.emit(e.node);
  // }

}
