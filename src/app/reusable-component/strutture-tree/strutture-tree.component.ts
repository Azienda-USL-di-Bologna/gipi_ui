import {Component, Input, OnChanges, OnInit, ViewChild} from "@angular/core";
import {Struttura} from "../../classi/server-objects/entities/struttura";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import {OdataContextFactory} from "@bds/nt-angular-context";
import {FunctionsImport} from "../../../environments/app.constants";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "strutture-tree",
  templateUrl: "./strutture-tree.component.html",
  styleUrls: ["./strutture-tree.component.css"]
})
export class StruttureTreeComponent implements OnInit {

  public datasource: DataSource;
  public datasourceForController: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu: any;
  private nodeInvolved: Object = {};

  @ViewChild("treeView") treeView: any;

  @Input("idAzienda") idAzienda: number;
  @Input("idAziendaTipoProcedimento") idAziendaTipoProcedimento: number;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;

  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    // costruzione menù contestuale sull'albero
    this.contextMenuItems = [{ text: "Espandi a strutture figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }



  selectionChanged(e) {
    if (this.readOnly) {
      // (e.event) indica se il metodo è chiamato da un evento, oppure no.
      // Al click del checkbox, la prima chiamata alla funzione arriverà attraverso un evento; la senconda invece no
      if (e.event) {
        if (e.itemData.selected === false) {
          this.treeView.instance.selectItem(e.itemData.id);
        } else {
          this.treeView.instance.unselectItem(e.itemData.id);
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
    this.treeView.instance.selectItem(this.nodeSelectedFromContextMenu.id);
    // this.treeView.selectNodesRecursive = false;

    this.nodeSelectedFromContextMenu.selected = true;
    this.setSelectedNodeRecursively(this.nodeSelectedFromContextMenu);
    // console.log('VAL: ' + this.nodeSelectedFromContextMenu.id);
  }

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

  sendData() {
    const req = this.http.post("http://localhost:10006/gipi/resources/custom/updateProcedimenti", {
      idAziendaTipoProcedimento: this.idAziendaTipoProcedimento,
      nodeInvolved: this.nodeInvolved
    })
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log("Error occured");
            }
        );
  }
}

const NodeOperations  = {INSERT: "insert", DELETE: "delete"}
