import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TipoProcedimento } from "../../classi/server-objects/entities/tipo-procedimento";
import { Procedimento } from "../../classi/server-objects/entities/procedimento";

@Component({
  selector: "dettaglio-tipo-procedimento",
  templateUrl: "./dettaglio-tipo-procedimento.component.html",
  styleUrls: ["./dettaglio-tipo-procedimento.component.scss"]
})
export class DettaglioTipoProcedimentoComponent implements OnInit {
  public proc: Procedimento;

  // tslint:disable-next-line:no-input-rename
  @Input()
  set procedimento(procedimento: Procedimento) {
    console.log("Sono nell'@Input");
    console.log("INPUT PROCEDIMENTO", procedimento);
    this.proc = procedimento;
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();

  constructor() {
    console.log("constructor = DettaglioTipoProcedimento");
    // console.log("constructor this.proc ---> ", this.proc);
   }

  ngOnInit() {
    console.log("ngOnInit = DettaglioTipoProcedimento");
    // console.log("ngOnInit this.proc ---> ", this.proc);
  }
}
