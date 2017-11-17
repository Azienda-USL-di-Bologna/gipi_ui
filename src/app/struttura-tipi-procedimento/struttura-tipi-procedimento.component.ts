import { Component, OnInit, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { SharedData } from "@bds/nt-angular-context/shared-data";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import ODataStore from 'devextreme/data/odata/store';
import { Struttura } from "../classi/server-objects/entities/struttura";
import { FunctionsImport } from "../../environments/app.constants";


@Component({
  selector: 'app-struttura-tipi-procedimento',
  templateUrl: './struttura-tipi-procedimento.component.html',
  styleUrls: ['./struttura-tipi-procedimento.component.css']
})
export class StrutturaTipiProcedimentoComponent implements OnInit {

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu : any;
  @ViewChild("treeView") treeView: any;

  constructor(private sharedData: SharedData, private odataContextFactory: OdataContextFactory, private router: Router) {

    //COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: "Espandi a strutture figlie" }];

  //   this.datasource = new DataSource({
  //     store: this.odataContextDefinition.getContext()[Entities.Struttura],
  //     filter: ['FK_id_azienda', '=', 5], //Il valore numerico è l'id dell'azienda, aperto RM per renderlo parametrizzabile
  //   });
  //  }
  
  this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();  
  
  this.datasource = new DataSource({
    store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
    customQueryParams: {
      idTipoProcedimento: 33,
      idAzienda: 5
    }
  });
 }  

  ngOnInit() {
  }


  caricamentoAlbero(e) { 
    let value = e.node;
    console.log(e.node);

  }

  //Questo evento scatta quando clicchiamo sul nodo dell'albero per far aprire il menu contestuale: in questo momento ci salviamo il nodo cliccato
  openContextMenu(e) { 
    this.nodeSelectedFromContextMenu = e.itemData;
    //this.abilitaRicorsione = true;
  }

  //Questo scatta quando clicchiamo sulla voce del menu contestuale "Espandi..."
  contextualItemClick(e) { 
  
    //FUNZIONE CHE SELEZIONA TUTTI I FIGLI
    console.log(this.datasource);

    
    this.treeView.selectNodesRecursive = true;
    this.treeView.instance.selectItem(this.nodeSelectedFromContextMenu.id);
    this.treeView.selectNodesRecursive = false;

    this.nodeSelectedFromContextMenu.selected = true;
    
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

  private setSelectedNodeRecursively(node : any) : void {

    // this.node.item
  
  }

}