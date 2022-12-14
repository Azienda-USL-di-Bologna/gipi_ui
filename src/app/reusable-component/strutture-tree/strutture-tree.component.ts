import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { GetStruttureByTipoProcedimento, Struttura } from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory, ResponseMessages, ErrorMessage, CustomLoadingFilterParams } from "@bds/nt-context";
import { HttpClient } from "@angular/common/http";
import notify from "devextreme/ui/notify";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH } from "../../../environments/app.constants";
import { debug } from "util";

@Component({
  selector: "strutture-tree",
  templateUrl: "./strutture-tree.component.html",
  styleUrls: ["./strutture-tree.component.scss"]
})
export class StruttureTreeComponent implements OnInit {

  private nodeSelectedFromContextMenu: any;
  private nodeInvolved: Object = {};
  private _nodesToCheckSelectedStatus: Object = {};
  private _popupVisible: boolean;
  private odataContextDefinitionFI;
  private odataContextDefinition;

  private NO_DELETE_ERROR_CODE: number = 1;

  private searchResultSelectedNode: any;
  private searchResultLookup: any;
  private itemToExpand: any;

  private elmTreeFromSearch: any;
  private elmTreeSelected: any;
  private argStr: any;

  private selectedNode: any;

  public datasource: DataSource;
  public datasourceStrutture: DataSource;
  public contextMenuItems;
  public showContextMenu: boolean = false;

  public popupRicercaVisible: boolean = false;

  @ViewChild("tree") tree: any;

  @Input("idAzienda") idAzienda: number;
  @Input("idAziendaTipoProcedimento") idAziendaTipoProcedimento: number;
  @Input("readOnly") readOnly: boolean;
  @Input("disabled") disabled: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input("nodesToCheckSelectedStatus") nodesToCheckSelectedStatus: any;
  @Input() 
  set ricarica(ricarica: any) {
    if (ricarica.ricarica) this.creaDataSourceTree();
  }
  @Output("strutturaSelezionata") strutturaSelezionata = new EventEmitter<Object>();
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter<Object>();

  enterIntoChangeSelection: boolean = true;

  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    // costruzione men?? contestuale sull'albero
    this.contextMenuItems = [{ text: "Seleziona con tutte le strutture figlie" }, { text: "Deseleziona con tutte le strutture figlie" }];

    this.odataContextDefinitionFI = odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
  }


  @Input()
  set popupVisible(visibile: boolean) {
    this._popupVisible = visibile;
  }

  get popupVisible(): boolean { return this._popupVisible; }


  private setSelectedNodeRecursively(node: any, select: boolean): void {
    // console.log("segnaposto");

    const res = this.getNestedChildren(this.datasource.items(), node.id, select);

    res.forEach(function (element) {
      element.selected = select;
    });
  }


  // questa ?? una funzione generica, si potrebbe generalizzare
  // voglio cercare un nodo, nodes ?? organizzato come array di array, gli array pi?? interni sono i nodi figli 
  private setSelectedNode(nodes: any, key: number) {
    this.selectedNode = nodes.find(item => {
      return item.itemData.id === key;
    });
    // se non ho ancora trovato il nodo, continuo 
    if (!this.selectedNode) {
      for (let i = 0; i < nodes.length; i++) {
        this.setSelectedNode(nodes[i].items, key);
        if (this.selectedNode) {
          break;
        }
      }
    }
  }


  private getNestedChildren(inputArray, selectedNode, select: boolean) {
    const result = [];

    for (const i in inputArray) {
      if (inputArray[i].idStrutturaPadre === selectedNode) {
        this.getNestedChildren(inputArray, inputArray[i].id, select);

        if (select)
          this.tree.instance.selectItem(inputArray[i].id);
        else
          this.tree.instance.unselectItem(inputArray[i].id);
        result.push(inputArray[i]);
      }
    }
    return result;
  }

  selectionChanged(e) {
    // Devo controllare se la popup ?? visibile perch??, se lo ?? devo disabilitare momentaneamente questa parte di codice
    // che non permette di cambiare lo stato del selected in quanto lo rimette come era prima. Questo perch?? voglio
    // vedere l'albero nella pagina sottostante aggiornarsi in real-time in base alle modifiche fatte nella popup. Quando
    // la popup torna non visibile, allora la funzionalit?? seguente rientra in funzione.
    if (this.readOnly) {
      if (!this._popupVisible) {

        if (this.enterIntoChangeSelection) {

          this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
          if (e.itemData.selected === false) {
            this.tree.instance.selectItem(e.itemData.id);
          } else {
            this.tree.instance.unselectItem(e.itemData.id);
          }
        } else {
          this.enterIntoChangeSelection = !this.enterIntoChangeSelection;
        }
      }
    } else {
      // Se ?? gi?? presente nell'array, lo rimuovo perch?? vuol dire che ho annullato l'operazione fatta riportando il nodo allo stato originale.
      // Se entro nell'else, allora aggiungo il nodo con l'operazione corente al check.
      if (this.nodeInvolved[e.itemData.id])
        delete this.nodeInvolved[e.itemData.id];
      else
        this.nodeInvolved[e.itemData.id] = e.itemData.selected ? NodeOperations.INSERT : NodeOperations.DELETE;
    }
  }

  ngOnInit() {
    this.creaDataSourceTree();
    this.creaDatasourceLookup();
  }

  creaDatasourceLookup() {
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams();
    customLoadingFilterParams.addFilter("nome", ["tolower(${target})", "contains", "${value.tolower}"]);

    this.datasourceStrutture = new DataSource({
      store: this.odataContextDefinition.getContext()[new Struttura().getName()]
      .on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        this.odataContextDefinition.customLoading(loadOptions);
      }),
      expand: ["idAzienda", "idStrutturaPadre"],
      filter: [["idAzienda.id", "=", this.idAzienda], ["attiva", "=", true]],
      sort: ["nome"]
    });
  }

  creaDataSourceTree() {
    this.datasource = new DataSource({
      store: this.odataContextDefinitionFI.getContext()[new GetStruttureByTipoProcedimento().getName()],
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
  }


  // Questo scatta quando clicchiamo sulla voce del menu contestuale "Espandi..."
  contextualItemClick(e) {

    switch (e.itemIndex) {
      case 0:
        this.nodeSelectedFromContextMenu.selected = true;
        this.tree.instance.selectItem(this.nodeSelectedFromContextMenu);
        this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu, true);
        this.tree.instance.expandItem(this.nodeSelectedFromContextMenu);
        break;

      case 1:
        this.nodeSelectedFromContextMenu.selected = false;
        this.tree.instance.unselectItem(this.nodeSelectedFromContextMenu);
        this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu, false);
        this.tree.instance.expandItem(this.nodeSelectedFromContextMenu);
        break;
    }
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
            // controllo se nell'errore ?? presente httpCode, se lo ?? vuol dire che l'errore ?? del tipo ResponseMessage
            if (err.error && err.error.httpCode && err.error.isBdsException) {

              // se l'errore ?? del tipo ResponseMessage, lo parso nell'oggetto corrispondente
              const responseMessages: ResponseMessages = err.error;

              // estraggo i messaggi di errore
              const errorMessages: ErrorMessage[] = responseMessages.errorMessages;

              // anche se ?? possibile passare pi?? messaggi di errore, per scelta, in questo caso ce ne sar?? solo 1
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
            else { // se l'errore non ?? del tipo ResponseMessage, allora mostro un errore generico
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

  public getClassNewTree() {
    return "tree-without-checks";
  }

  public selezionaStruttura(id: number, nome: string, hasChildren: boolean) {
    const obj = {
      id: id,
      nome: nome,
      hasChildren: hasChildren
    };
    this.strutturaSelezionata.emit(obj);
  }

  public showStatusOperation(message: string, type: string) {
    notify({
      message: message,
      type: type,
      displayTime: 1700,
      width: TOAST_WIDTH,
      position: {
        my: "center",
        at: "center",
        // offset: "-100 20",
        // of: "#center-div"
        of: window        
      }
    });
  }

  handleEvent(name: string, event: any) {
    // console.log(name, event);

    switch (name) {

      // LOOKUP RICERCA
      case "onSelectionChangedLookupRicerca":
        // console.log("segnaposto", event);

        // HO EFFETTUATO UNA RICERCA, AGISCO SULL'ALBERO PER SELEZIONARE IL NODO DELLA STRUTTURA SCELTA
        this.searchResultLookup = event.selectedItem;

        // espando il nodo scelto, in questo modo mi espande anche tutti i genitori, se ne ha
        this.tree.instance.expandItem(this.searchResultLookup.id);

/*         if (this.searchResultLookup.idStrutturaPadre) {
          this.tree.instance.expandItem(this.searchResultLookup.idStrutturaPadre.id);
        } */

        // mi devo trovare l'elemento del DOM in modo da settarlo come selezionato (evidenziato di blu). 
        // La selezine di devextreme non funziona perch?? l'albero ha le check-box
        // non funziona neanche assegnandogli la classe css (state-selected) di devextreme, quindi mi sono creato una classe css da assegnargli
        this.argStr = "[data-item-id=\"" + this.searchResultLookup.id + "\"]";

        // tolgo la selezione al nodo precedentemente selezionato
        if (this.elmTreeSelected) {
          this.elmTreeSelected.classList.remove("tree-item-selected");
        }
        // trovo l'elemento del DOM
        let  elmTreeFromSearchParent = this.tree.element.nativeElement.querySelectorAll(this.argStr)[0]; // questo ?? il nodo padre, contiene anche la check-box
        this.elmTreeFromSearch = elmTreeFromSearchParent.childNodes[1]; // questo ?? il nodo figlio, l'item cercato. E' corretto riferirmi in modo posizionale??
        this.elmTreeSelected = this.elmTreeFromSearch;
        // lo seleziono
        this.elmTreeSelected.classList.add("tree-item-selected");

        // mi prendo il Nodo di quell'elemento. Mi serve il nodo perch?? solo li ho l'informazione se ha figli
        this.setSelectedNode(this.tree.instance.getNodes(), this.searchResultLookup.id);

        this.selezionaStruttura(this.selectedNode.key, this.selectedNode.text, this.selectedNode.children.length > 0);
        break;

      case "onOpenedLookupRicerca":
        // console.log("segnaposto");

        this.creaDataSourceTree();
        break;


      // ALBERO
      case "onOptionChangedTree":
        break;

      case "onItemSelectionChangedTree":
          // console.log("segnaposto");

          this.selectionChanged(event);
          break;
        
      case "onItemClickTree":
        // console.log("segnaposto", event);

        // la visualizzazione dells voce selezionata blu si deve gestire a mano (perch?? l'albero ha le checkbox e per lui selected vuol dire chcchato)
        // anche al click devo gestire la selezione, togliendola dal nodo precedentemente selezionato e aggiungendola al nuovo
        if (this.elmTreeSelected) {
          this.elmTreeSelected.classList.remove("tree-item-selected");
        }
        this.elmTreeSelected = event.itemElement;
        this.elmTreeSelected.classList.add("tree-item-selected");
        
         this.selezionaStruttura(event.itemData.id, event.itemData.nome, event.node.children.length > 0);
        break;

      case "onItemExpandedTree":
        // console.log("segnaposto", event);
        
      // scrollo fino all elemento selezionato (quando vengo dalla ricerca)
      if (this.tree.instance && this.tree.instance._scrollableContainer && this.elmTreeFromSearch) {
          this.tree.instance._scrollableContainer.scrollToElement(this.elmTreeFromSearch);
          this.elmTreeFromSearch = null;
        } 
        break;

      case "onContentReadyTree":
        // console.log("segnaposto", event);
        break;

    }
  } // fine di handleEvent


  apriRicerca() {
    this.popupRicercaVisible = true;
  }

}

export const NodeOperations = { INSERT: "INSERT", DELETE: "DELETE" };
