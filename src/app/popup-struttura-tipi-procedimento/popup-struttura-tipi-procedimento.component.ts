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

  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private odataContextDefinition;

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  public testoHeaderTipoProcedimento: string;
  public idAzienda: number;
  public idAziendaTipoProcedimento: number;
  public ricarica: any;

  @ViewChild("tree") tree: StruttureTreeComponent;
  @Input("readOnly") readOnly: boolean;
  @Input("enableCheckRecursively") enableCheckRecursively: boolean;
  @Input() 
  set aziendaTipoProcedimentoObj(obj: any) {
    this.idAzienda = obj.idAzienda;
    this.idAziendaTipoProcedimento = obj.idAziendaTipoProcedimento;
    this.testoHeaderTipoProcedimento = obj.headerTipoProcedimento;
    this.ricarica = { ricarica: true };
  }
  @Input("lanciaRefreshAlPadre") lanciaRefreshAlPadre: boolean;
  @Output("refreshAfterChange") refreshAfterChange = new EventEmitter<Object>();
  @Output("closePopup") closePopup = new EventEmitter<Object>();

  constructor(private globalContextService: GlobalContextService, private odataContextFactory: OdataContextFactory, private router: Router) {
  }

  ngOnInit() {
    /* this.idAzienda = this.aziendaTipoProcedimentoObj.idAzienda;
    this.idAziendaTipoProcedimento = this.aziendaTipoProcedimentoObj.idAziendaTipoProcedimento;
    this.testoHeaderTipoProcedimento = this.aziendaTipoProcedimentoObj.headerTipoProcedimento; */
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  sendDataConfirm() {
    console.log("debug");
    
     // INOLTRO LA CHIAMATA AL FIGLIO
     this.tree.sendDataConfirm();
  }

  sendDataCancel() { 
    this.tree.setDataCancel();
  }

  refresh(nodeInvolved) {
    if (this.lanciaRefreshAlPadre) {
      // La popup avvisa il padre che è cambiata la configurazione dell'albero
      this.refreshAfterChange.emit(nodeInvolved);
    } else {
      // La popup viene chiusa
      this.closePopup.emit();
    }
  }
}
