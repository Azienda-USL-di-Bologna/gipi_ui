import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { SharedData } from "@bds/nt-angular-context/shared-data";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import ODataStore from "devextreme/data/odata/store";
import { Struttura } from "../classi/server-objects/entities/struttura";
import { FunctionsImport } from "../../environments/app.constants";
import {forEach} from "@angular/router/src/utils/collection";
import { StruttureTreeComponent } from "../reusable-component/strutture-tree/strutture-tree.component";

@Component({
  selector: 'popup-struttura-tipi-procedimento',
  templateUrl: './popup-struttura-tipi-procedimento.component.html',
  styleUrls: ['./popup-struttura-tipi-procedimento.component.css']
})
export class PopupStrutturaTipiProcedimentoComponent implements OnInit {

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private testoHeaderTipoProcedimento: string;
  private testoHeaderAzienda: string;
  private idAzienda: number;
  private idAziendaTipoProcedimento: number;

  @ViewChild("treeView") treeView: StruttureTreeComponent;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input("aziendaTipoProcedimentoObj") aziendaTipoProcedimentoObj: any;
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter<Object>();

  constructor(private sharedData: SharedData, private odataContextFactory: OdataContextFactory, private router: Router) {
 }

  ngOnInit() {

    this.idAzienda = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.idAzienda.id;
    this.idAziendaTipoProcedimento = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.id;
    this.testoHeaderAzienda = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.idAzienda.descrizione;
    this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.idTipoProcedimento.nomeTipoProcedimento;
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  sendDataConfirm() {
     //INOLTRO LA CHIAMATA AL FIGLIO
     this.treeView.sendDataConfirm();
  }

  sendDataCancel() { 
    this.treeView.setDataCancel();
  }

  //La popup avvisa il padre che è cambiata la configurazione dell'albero
  refresh(nodeInvolved) { 
    this.refreshAfterChange.emit(nodeInvolved);
  }
}
