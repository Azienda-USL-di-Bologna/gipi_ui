import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import {Struttura} from "../../classi/server-objects/entities/struttura";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import {OdataContextFactory} from "@bds/nt-angular-context";
import { FunctionsImport } from "../../../environments/app.constants";
import { SharedData } from '@bds/nt-angular-context/shared-data';
import {HttpClient} from "@angular/common/http";
import notify from 'devextreme/ui/notify';

@Component({
  selector: "strutture-tree",
  templateUrl: "./strutture-tree.component.html",
  styleUrls: ["./strutture-tree.component.css"]
})
export class StruttureTreeComponent implements OnInit {

  public datasource: DataSource;
  public datasourceOriginal: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu: any;
  private nodeInvolved: Object = {};
  private _nodesToCheckSelectedStatus : Object = {};  
  private _popupVisible:boolean ;


  @ViewChild("treeViewChild") treeViewChild: any;

  @Input("idAzienda") idAzienda: number;
  @Input("idAziendaTipoProcedimento") idAziendaTipoProcedimento: number;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input("nodesToCheckSelectedStatus") nodesToCheckSelectedStatus: any;
  @Output("strutturaSelezionata") strutturaSelezionata = new EventEmitter<Object>();
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter <Object>();
  
  enterIntoChangeSelection : boolean = true;
  
  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    // costruzione menù contestuale sull'albero
    this.contextMenuItems = [{ text: "Espandi a strutture figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  @Input()
  set popupVisible(visibile: boolean) {
    this._popupVisible = visibile;
  }

  get popupVisible() : boolean { return this._popupVisible }

  selectionChanged(e) {
    //Devo controllare se la popup è visibile perchè, se lo è devo disabilitare momentaneamente questa parte di codice
    //che non permette di cambiare lo stato del selected in quanto lo rimette come era prima. Questo perchè voglio
    //vedere l'albero nella pagina sottostante aggiornarsi in real-time in base alle modifiche fatte nella popup. Quando
    //la popup torna non visibile, allora la funzionalità seguente rientra in funzione.
    if (this.readOnly) {  
      if (!this._popupVisible) {

        if (this.enterIntoChangeSelection) {
          
            this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
              if (e.itemData.selected === false) {
                     this.treeViewChild.instance.selectItem(e.itemData.id);
              } else {
                    this.treeViewChild.instance.unselectItem(e.itemData.id);
              }      
          }
          else { 
            this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
          }
      }
    }
    else {
      // Se è già presente nell'array, lo rimuovo perchè vuol dire che ho annullato l'operazione fatta riportando il nodo allo stato originale.
      // Se entro nell'else, allora aggiungo il nodo con l'operazione corente al check.
      if (this.nodeInvolved[e.itemData.id])
        delete this.nodeInvolved[e.itemData.id];
      else
        this.nodeInvolved[e.itemData.id] = e.itemData.selected ? NodeOperations.INSERT : NodeOperations.DELETE;
    }
  }

  ngOnInit() {
    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
      customQueryParams: {
        idAziendaTipoProcedimento: this.idAziendaTipoProcedimento,
        idAzienda: this.idAzienda
      }
    }); 
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
    this.treeViewChild.instance.selectItem(this.nodeSelectedFromContextMenu.id);
    // this.treeView.selectNodesRecursive = false;

    this.nodeSelectedFromContextMenu.selected = true;
    this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu);
    // console.log('VAL: ' + this.nodeSelectedFromContextMenu.id);
  }

  private setSelectedNodeRecursively(node: any): void {
    // this.node.item
    const res = this.getNestedChildren(this.datasource.items(), node.id);

    res.forEach(function (element) {
      element.selected = true;
    });
  }

  private getNestedChildren(inputArray, selectedNode) {
    const result = []
    for (const i in inputArray) {
      if (inputArray[i].idStrutturaPadre === selectedNode) {
        this.getNestedChildren(inputArray, inputArray[i].id);
        this.treeViewChild.instance.selectItem(inputArray[i].id);
        result.push(inputArray[i]);
      }
    }
    return result;
  }

  public sendDataConfirm() {
    if (Object.keys(this.nodeInvolved).length > 0) {
      const req = this.http.post("http://localhost:10006/gipi/resources/custom/updateProcedimenti", {
        idAziendaTipoProcedimento: this.idAziendaTipoProcedimento,
        nodeInvolved: this.nodeInvolved
      })
        .subscribe(
        res => {
          this.showStatusOperation("Modifica andata a buon fine", "success");
          this.refreshAfterChange.emit(this.nodeInvolved);
          this.nodeInvolved = {};
        },
        err => {
          this.showStatusOperation("Associazione non andata a buon fine", "error");
        }
        );
    }
    else { 
      this.refreshAfterChange.emit(this.nodeInvolved);
      this.nodeInvolved = {};
    }
  }

  public setDataCancel() {  
    this.datasource.load();
    this.nodeInvolved = {};
    this.refreshAfterChange.emit(this.nodeInvolved);
  }

public getClass() {
    if(this.readOnly)
      return "tree-readonly dx-checkbox-icon";
    else
      return "tree-not-readonly dx-checkbox-icon";
  }

public  selezionaStruttura(e) {
    const obj = {
      id: e.itemData.id,
      nome: e.itemData.nome
    };
    this.strutturaSelezionata.emit(obj);
  }

public showStatusOperation(message:string, type:string){
  
    notify( {
      message: message,
      type: type,
      displayTime: 1700,
      position: {
          my: "top",
          at: "top",
          of: "#center-div"
       }
    });
  }

}

export const NodeOperations  = {INSERT: "INSERT", DELETE: "DELETE"}
