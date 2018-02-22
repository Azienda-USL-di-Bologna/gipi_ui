import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {AziendaTipoProcedimento, Titolo} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory, GlobalContextService, OdataContextDefinition } from "@bds/nt-context";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {
  public proc: AziendaTipoProcedimento;
  public odataContextDefinition: OdataContextDefinition;
  public dataSourceTitoli: DataSource;
  public idAzienda: number;

  // tslint:disable-next-line:no-input-rename
  @Input()
  set procedimento(procedimento: AziendaTipoProcedimento) {
    console.log("Sono nell'@Input");
    console.log("INPUT PROCEDIMENTO", procedimento);
    this.proc = procedimento;
  }

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(odataContextFactory: OdataContextFactory, globalContextService: GlobalContextService) {
    console.log("constructor = DettaglioTipoProcedimento");
    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
    this.idAzienda = globalContextService.getInnerSharedObject("loggedUser._aziendaLogin.id")
    console.log("LOGGAMENTO", globalContextService.getInnerSharedObject("loggedUser"));
    this.dataSourceTitoli = new DataSource({
      store: this.odataContextDefinition.getContext()[new Titolo().getName()],
    });
 
   }

  ngOnInit() {
    console.log("ngOnInit = DettaglioTipoProcedimento");
    // console.log("ngOnInit this.proc ---> ", this.proc);
    
  }


  public close() {
    console.log("CLOSE");
    this.messageEvent.emit({visible: false});
  }

  public save() {
    // codice codice codice
    this.close();
  }
}
