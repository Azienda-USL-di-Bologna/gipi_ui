import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import {OdataContextFactory} from "@bds/nt-context";
import { Struttura } from "@bds/nt-entities";
import { StruttureTreeComponent } from "../reusable-component/strutture-tree/strutture-tree.component";
import {  GlobalContextService } from "@bds/nt-context";

@Component({
  selector: "popup-struttura-tipi-procedimento",
  templateUrl: "./popup-struttura-tipi-procedimento.component.html",
  styleUrls: ["./popup-struttura-tipi-procedimento.component.css"]
})
export class PopupStrutturaTipiProcedimentoComponent implements OnInit {

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  public testoHeaderTipoProcedimento: string;
  //public testoHeaderAzienda: string;
  public idAzienda: number;
  public idAziendaTipoProcedimento: number;

  @ViewChild("treeView") treeView: StruttureTreeComponent;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input("aziendaTipoProcedimentoObj") aziendaTipoProcedimentoObj: any;
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter<Object>();

  constructor(private globalContextService: GlobalContextService, private odataContextFactory: OdataContextFactory, private router: Router) {
 }

  ngOnInit() {

    this.idAzienda = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.idAzienda.id;
    this.idAziendaTipoProcedimento = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.id;
    //this.testoHeaderAzienda = this.aziendaTipoProcedimentoObj.aziendaTipoProcedimento.idAzienda.descrizione;
    this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimentoObj.headerTipoProcedimento;
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  sendDataConfirm() {
     // INOLTRO LA CHIAMATA AL FIGLIO
     this.treeView.sendDataConfirm();
  }

  sendDataCancel() { 
    this.treeView.setDataCancel();
  }

  // La popup avvisa il padre che è cambiata la configurazione dell'albero
  refresh(nodeInvolved) { 
    this.refreshAfterChange.emit(nodeInvolved);
  }
}
