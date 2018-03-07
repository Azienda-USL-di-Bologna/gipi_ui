import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import {GetStruttureByTipoProcedimento, Struttura} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import {OdataContextFactory, ResponseMessages, ErrorMessage} from "@bds/nt-context";
import {HttpClient} from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { CUSTOM_RESOURCES_BASE_URL } from "../../../environments/app.constants";

@Component({
  selector: "strutture-tree",
  templateUrl: "./strutture-tree.component.html",
  styleUrls: ["./strutture-tree.component.scss"]
})
export class StruttureTreeComponent implements OnInit {

  private nodeSelectedFromContextMenu: any;
  private nodeInvolved: Object = {};
  private _nodesToCheckSelectedStatus: Object = {};
  private _popupVisible: boolean ;
  private odataContextDefinition;

  private NO_DELETE_ERROR_CODE: number = 1;

  public datasource: DataSource;
  public datasourceOriginal: DataSource;
  public strutture: Struttura = new Struttura();
  public contextMenuItems;
  public showContextMenu: boolean = false;


  @ViewChild("treeViewChild") treeViewChild: any;

  @Input("idAzienda") idAzienda: number;
  @Input("idAziendaTipoProcedimento") idAziendaTipoProcedimento: number;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input("nodesToCheckSelectedStatus") nodesToCheckSelectedStatus: any;
  @Output("strutturaSelezionata") strutturaSelezionata = new EventEmitter<Object>();
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter <Object>();

  enterIntoChangeSelection: boolean = true;

  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    // costruzione menù contestuale sull'albero
    this.contextMenuItems = [{ text: "Seleziona con tutte le strutture figlie" }, { text: "Deseleziona con tutte le strutture figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  @Input()
  set popupVisible(visibile: boolean) {
    this._popupVisible = visibile;
  }

  get popupVisible(): boolean { return this._popupVisible; }

  selectionChanged(e) {
    // Devo controllare se la popup è visibile perchè, se lo è devo disabilitare momentaneamente questa parte di codice
    // che non permette di cambiare lo stato del selected in quanto lo rimette come era prima. Questo perchè voglio
    // vedere l'albero nella pagina sottostante aggiornarsi in real-time in base alle modifiche fatte nella popup. Quando
    // la popup torna non visibile, allora la funzionalità seguente rientra in funzione.
    if (this.readOnly) {
      if (!this._popupVisible) {

        if (this.enterIntoChangeSelection) {

            this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
              if (e.itemData.selected === false) {
                     this.treeViewChild.instance.selectItem(e.itemData.id);
              } else {
                    this.treeViewChild.instance.unselectItem(e.itemData.id);
              }
          } else {
            this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
          }
      }
    } else {
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
      store: this.odataContextDefinition.getContext()[new GetStruttureByTipoProcedimento().getName()],
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
    this.showContextMenu = true;
    
    // this.abilitaRicorsione = true;
  }

  onTreeViewClick(e) {
    console.log(e);
  }

  // Questo scatta quando clicchiamo sulla voce del menu contestuale "Espandi..."
  contextualItemClick(e) {
    
    switch (e.itemIndex)
    {
      case 0:
        this.nodeSelectedFromContextMenu.selected = true;  
        this.treeViewChild.instance.selectItem(this.nodeSelectedFromContextMenu);
        this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu, true);
        this.treeViewChild.instance.expandItem(this.nodeSelectedFromContextMenu);
        break;
        
      case 1:
      this.nodeSelectedFromContextMenu.selected = false;
      this.treeViewChild.instance.unselectItem(this.nodeSelectedFromContextMenu);
        this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu, false);  
        this.treeViewChild.instance.expandItem(this.nodeSelectedFromContextMenu);
        break;  
    }
    // this.treeView.selectNodesRecursive = true;
    // this.treeView.selectNodesRecursive = false;

    // console.log('VAL: ' + this.nodeSelectedFromContextMenu.id);
  }

  private setSelectedNodeRecursively(node: any, select: boolean): void {
    // this.node.item
    const res = this.getNestedChildren(this.datasource.items(), node.id, select);

    res.forEach(function (element) {
      element.selected = select;
    });
  }

  private getNestedChildren(inputArray, selectedNode, select: boolean) {
    const result = [];

    for (const i in inputArray) {
      if (inputArray[i].idStrutturaPadre === selectedNode) {
        this.getNestedChildren(inputArray, inputArray[i].id, select);

        if (select)
          this.treeViewChild.instance.selectItem(inputArray[i].id);
        else
          this.treeViewChild.instance.unselectItem(inputArray[i].id);
        result.push(inputArray[i]);
      }
    }
    return result;
  }

  public sendDataConfirm() {
    if (Object.keys(this.nodeInvolved).length > 0) {
      // const req = this.http.post("http://localhost:10006/gipi/resources/custom/updateProcedimenti", {
        const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "UpdateProcedimenti", {
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
            console.log("err: ", err);
            // TODO by gdm
            // TODO 1: rifattorizzare, il componente dovrebbe gestire solo l'albero delle struttre e non i procedimenti
            // TODO 2: valutare se fare questa gesione dell'errore in una classe a parte, magari con un metodo specifico e poi richiamarla qui
            // controllo se nell'errore è presente httpCode, se lo è vuol dire che l'errore è del tipo ResponseMessage
            if (err.error && err.error.httpCode) {

                // se l'errore è del tipo ResponseMessage, lo parso nell'oggetto corrispondente
                const responseMessages: ResponseMessages = err.error;

                // estraggo i messaggi di errore
                const errorMessages: ErrorMessage[] = responseMessages.errorMessages;

                // anche se è possibile passare più messaggi di errore, per scelta, in questo caso ce ne sarà solo 1
                const errorCode = errorMessages[0].code;

                // lo switch serve per mostrare i vari messaggi di errore in base al codice
                switch (errorCode) {
                    case this.NO_DELETE_ERROR_CODE:
                        this.showStatusOperation("Impossible togliere l'associazione: ci sono degli iter collegati", "error");
                        break;
                    default: // caso generale
                        this.showStatusOperation("Associazione non andata a buon fine", "error");
                }
            }
            else { // se l'errore non è del tipo ResponseMessage, allora mostro un errore generico
                this.showStatusOperation("Associazione non andata a buon fine", "error");
            }
        }
        );
    } else {
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
    if (this.readOnly)
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

public showStatusOperation(message: string, type: string) {

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

export const NodeOperations  = {INSERT: "INSERT", DELETE: "DELETE"};
