import {Component, Input, OnInit, ViewChild} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { SharedData } from "@bds/nt-angular-context/shared-data";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import ODataStore from "devextreme/data/odata/store";
import { Struttura } from "../classi/server-objects/entities/struttura";
import { FunctionsImport } from "../../environments/app.constants";
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: "app-struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.css"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;

  @ViewChild("treeView") treeView: any;

  constructor(private sharedData: SharedData, private odataContextFactory: OdataContextFactory, private router: Router) {

    // costruzione menù contestuale sull'albero
   // this.contextMenuItems = [{ text: "Espandi a strutture figlie" }];

  //   this.datasource = new DataSource({
  //     store: this.odataContextDefinition.getContext()[Entities.Struttura],
  //     filter: ['FK_id_azienda', '=', 5], //Il valore numerico è l'id dell'azienda, aperto RM per renderlo parametrizzabile
  //   });
  //  }

  // this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();

  /*this.datasource = new DataSource({
    store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
    customQueryParams: {
      idAziendaTipoProcedimento: 33,
      idAzienda: 5
    }
  });*/

        // this.datasource = new DataSource({
      //     store: new ODataStore({
      //         url: "http://localhost:10006/gipi/test/getTree"
      //     }),
      //     customQueryParams: {
      //         idAziendaTipoProcedimento: 33,
      //         idAzienda: 5
      //     }
      // });
 }

  ngOnInit() {
  }


  caricamentoAlbero(e) {
    const value = e.node;
  }

  /*Questo evento scatta quando clicchiamo sul nodo dell'albero per far aprire il menu contestuale
     in questo momento ci salviamo il nodo cliccato */
  openContextMenu(e) {
    this.nodeSelectedFromContextMenu = e.itemData;
    // this.abilitaRicorsione = true;
  }

  // Questo scatta quando clicchiamo sulla voce del menu contestuale "Espandi..."
  contextualItemClick(e) {

   // this.treeView.selectNodesRecursive = true;
    this.treeView.instance.selectItem(this.nodeSelectedFromContextMenu.id);
   // this.treeView.selectNodesRecursive = false;

    this.nodeSelectedFromContextMenu.selected = true;
    this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu);
    // console.log('VAL: ' + this.nodeSelectedFromContextMenu.id);
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  handleEvent(eventName: string, e: Event) {
    switch (eventName) {
      // case 'treeItemSelectionChanged':
      //   this.treeItemSelectionChanged(e);
      //   break;
    }
  }

  // private treeItemSelectionChanged(e) {
  //   this.emitTreeNodeSelected.emit(e.node);
  // }

  private setSelectedNodeRecursively(node: any): void {
    // this.node.item
      console.log("item: " + node);
      const res = this.getNestedChildren(this.datasource.items(), node.id);

      console.log("TREE");
      res.forEach(function (element) {
          element.selected = true;
          console.log(element.nome);
      });
  }

    private getNestedChildren(inputArray, selectedNode) {
    const result = []
    for (const i in inputArray) {
        if (inputArray[i].idStrutturaPadre === selectedNode) {
             this.getNestedChildren(inputArray, inputArray[i].id);
            this.treeView.instance.selectItem(inputArray[i].id);
            result.push(inputArray[i]);
        }
    }
    return result;
    }

    private esegui() {
      const res = this.datasource.items();
        res.forEach(function (element) {
            if (element.selected === true) {
                console.log(element.nome);
            }
        });
    }

    private setInitialState() {
         this.initialState = this.datasource.items();
    }
}


