import {Component, OnInit, ViewChild} from "@angular/core";
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

  @ViewChild("treeView") treeView: StruttureTreeComponent;

  constructor(private sharedData: SharedData, private odataContextFactory: OdataContextFactory, private router: Router) {
 }

  ngOnInit() {
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  sendData() { 
    //INOLTRO LA CHIAMATA AL FIGLIO
    this.treeView.sendData();
  }
}
